const gApi = require("../src/google-client/google-api");
const { v4: uuidv4 } = require("uuid");
const { format, startOfMonth, endOfMonth, getDate, getDaysInMonth } = require("date-fns");
const { createImageFromHtml } = require("../src/create-image-from-html/create-image-from-html");
const iikoServerApi = require("../src/iiko-api/iikoServerApi");
const iikoCloudApi = require("../src/iiko-api/iikoCloudApi");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");

const transformedDate = (date) => {
  const dateArray = date.split('.');
  const day = Number(dateArray[0]);
  const month = Number(dateArray[1]) - 1;
  const year = Number(dateArray[2]);
  return new Date(year, month, day);
};

const transformDeliverySales = (data) => {
  const serviceTypes = {
    COURIER: "Курьером",
    PICKUP: "Самовывоз",
  };

  return data
    .filter((deliveryItem) => !!deliveryItem["Delivery.ServiceType"])
    .map((item) => ({
      source: item["Delivery.MarketingSource"] || "По звонку",
      type: serviceTypes[item["Delivery.ServiceType"]],
      orderCount: item.UniqOrderId,
      sum: item.DishDiscountSumInt,
    }));
};

const saveMetrics = async (date) => {
  const currentDate = format(transformedDate(date), "yyyy-MM-dd");

  const deliverySales = await iikoServerApi.getDeliverySales(currentDate, currentDate);
  const filteredDeliveriesData = transformDeliverySales(deliverySales);
  const lunchSales = await iikoServerApi.getLunchSales(currentDate, currentDate);

  await gApi.saveMetrics({
    date: currentDate,
    delivery: filteredDeliveriesData,
    lunch: lunchSales[0]
      ? {
          count: lunchSales[0].UniqOrderId,
          sum: lunchSales[0].DishDiscountSumInt,
        }
      : undefined,
  });
};

const sendReportToTelegram = async (body) => {
  const currentDate = format(transformedDate(body.date), "yyyy-MM-dd");
  const currentFormattedDate = `${format(transformedDate(body.date), "yyyy-MM-dd")} 00:00:00.123`;

  const deliverySales = await iikoServerApi.getDeliverySales(currentDate, currentDate);
  const lunchSales = await iikoServerApi.getLunchSales(currentDate, currentDate);
  const reserveIds = (await iikoCloudApi.getReserveListIds(currentFormattedDate, currentFormattedDate)) || [];
  const prepays = await iikoCloudApi.getCurrentPrepays(reserveIds).then((data) =>
    data.filter((prepay) => {
      const prepayDate = format(new Date(prepay.timestamp), "yyyy-MM-dd");
      return prepayDate === currentDate;
    })
  );

  const filteredDeliveriesData = transformDeliverySales(deliverySales);

  const totalAmount = filteredDeliveriesData.reduce((sum, current) => sum + current.sum, 0);
  const total = filteredDeliveriesData.reduce((sum, current) => sum + current.orderCount, 0);
  const progressBarStartDate = format(startOfMonth(new Date()), "dd.MM");
  const progressBarEndDate = format(endOfMonth(new Date()), "dd.MM");
  const progressBarCurrentDate = format(new Date(), "dd.MM");
  const currentDay = getDate(new Date());
  const dayOfMonth = getDaysInMonth(new Date());
  const progress = Math.round((currentDay / dayOfMonth) * 100);
  const reports = await gApi.getDailyReports(
    format(startOfMonth(new Date()), "dd.MM.yyyy"),
    format(new Date(), "dd.MM.yyyy")
  );
  const revenue = reports.reduce((sum, current) => Math.floor(Number(sum) + Number(current.totalSum)), 0);

  const image = await createImageFromHtml({
    ...body,
    expenses: body.expenses.map((item) => ({ ...item, title: item.category.title })),
    type: body.type === "add" ? "Отчет" : "Обновление отчета",
    yandex: body.yandex || "0",
    deliveries: filteredDeliveriesData,
    totalDeliveries: total,
    totalDeliveriesSum: totalAmount,
    ...lunchSales[0],
    progressBarStartDate,
    progressBarCurrentDate,
    progressBarEndDate,
    revenue,
    progress: `${progress}%`,
    prepays,
  });

  await tbot.sendPhoto(getTelegramChatId("reports"), image, undefined, { contentType: "image/jpeg" });
};

const receiptsOperationValues = {
  ipCash: { title: "Поступления наличные средства", type: "Наличные", comment: "по ИП" },
  oooCash: { title: "Поступления наличные средства", type: "Наличные", comment: "по ООО" },
};

async function getReports(req, res) {
  try {
    const data = await gApi.getDailyReports(req.query.from, req.query.to);

    return res.json({ status: "OK", data });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function clearReports(req, res) {
  try {
    await gApi.clearReport();
    return res.json({ status: "OK" });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function addReport(req, res) {
  const { body } = req;
  const id = uuidv4();
  const data = { ...body, id };

  try {
    await gApi.addReport(data);

    for (const expense of body.expenses) {
      await gApi.addFinancialOperation([expense.id, body.date, expense.category.title, 'Наличные', expense.sum.replace('.', ','), expense.counterparty || '', expense.comment || '']);
    }

    for (const receipt of Object.keys(receiptsOperationValues)) {
      const value = receiptsOperationValues[receipt];

      if (body[receipt]) {
        await gApi.addFinancialOperation(['', body.date, value.title, value.type, body[receipt].replace('.', ','), value.counterparty || '', value.comment || '']);
      }
    }

    const getExpenses = await gApi.getExpenses();
    if (getExpenses.length) {
      await gApi.deleteExpense();
    }

    await sendReportToTelegram({ ...body, type: 'add' });
    await saveMetrics(body.date);
  } catch (err) {
    console.log(err, 'err');
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK', data });
}

async function updateReport(req, res) {
  const { body } = req;

  try {
    const reports = await gApi.getDailyReports(req.query.from, req.query.to);
    const reportExpenses = (reports.find((report) => report.id === body.id) || {}).expenses;
    const oldExpenses = typeof reportExpenses === "object" ? reportExpenses : JSON.parse(reportExpenses || "");
    const operations = await gApi.getFinancialOperations();

    await gApi.updateReport(body);

    for (const expense of body.expenses) {
      const hasExpense = oldExpenses.find((exp) => exp.id === expense.id);
      if (hasExpense) {
        await gApi.updateFinancialOperation(
          expense.id,
          [
            body.date,
            expense.category.title,
            "Наличные",
            expense.sum.replace(".", ","),
            expense.counterparty || "",
            expense.comment,
          ],
          operations
        );
      } else {
        await gApi.addFinancialOperation([
          expense.id,
          body.date,
          expense.category.title,
          "Наличные",
          expense.sum.replace(".", ","),
          expense.counterparty || "",
          expense.comment,
        ]);
      }
    }

    for (const receipt of Object.keys(receiptsOperationValues)) {
      const value = receiptsOperationValues[receipt];
      if (body[receipt]) {
        await gApi.updateFinancialOperation(
          undefined,
          [
            body.date,
            value.title,
            value.type,
            body[receipt].replace(".", ","),
            value.counterparty || "",
            value.comment,
          ],
          operations
        );
      }
    }

    const idsToDelete = [];
    oldExpenses.forEach((i) => {
      if (!body.expenses.find((j) => j.id === i.id)) {
        idsToDelete.push(i.id);
      }
    });

    if (idsToDelete.length) {
      for (const id of idsToDelete) {
        await gApi.deleteFinancialOperation(id);
      }
    }

    await sendReportToTelegram({ ...body, type: "update" });
    await saveMetrics(body.date);
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }

  return res.json({ status: "OK" });
}

module.exports = { getReports, clearReports, addReport, updateReport };

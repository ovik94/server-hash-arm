const gApi = require("../src/google-client/google-api");
const { format, startOfMonth, endOfMonth, getDate, getDaysInMonth, isAfter, isBefore, isEqual } = require("date-fns");
const { createImageFromHtml } = require("../src/create-image-from-html/create-image-from-html");
const iikoServerApi = require("../src/iiko-api/iikoServerApi");
const iikoCloudApi = require("../src/iiko-api/iikoCloudApi");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const DailyReportModel = require("../model/dailyReport");

const sendReportToTelegram = async (body) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const currentFormattedDate = `${format(new Date(), 'yyyy-MM-dd')} 00:00:00.123`;

  const deliverySales = await iikoServerApi.getDeliverySales(format(new Date(), 'yyyy-MM-dd'));
  const lunchSales = await iikoServerApi.getLunchSales(format(new Date(), 'yyyy-MM-dd'));
  const reserveIds = await iikoCloudApi.getReserveListIds(currentFormattedDate) || [];
  const prepays = await iikoCloudApi.getCurrentPrepays(reserveIds).then(data => data.filter(prepay => {
    const prepayDate = format(new Date(prepay.timestamp), 'yyyy-MM-dd');
    return prepayDate === currentDate
  }))

  const serviceTypes = {
    COURIER: 'Курьером',
    PICKUP: 'Самовывоз'
  };

  const filteredDeliveriesData = deliverySales
    .filter(deliveryItem => !!deliveryItem['Delivery.ServiceType'])
    .map(item => ({
      source: item['Delivery.MarketingSource'] || 'По звонку',
      type: serviceTypes[item['Delivery.ServiceType']],
      orderCount: item.UniqOrderId,
      sum: item.DishDiscountSumInt
    }));

  const totalAmount = filteredDeliveriesData.reduce((sum, current) => sum + current.sum, 0);
  const total = filteredDeliveriesData.reduce((sum, current) => sum + current.orderCount, 0);
  const progressBarStartDate = format(startOfMonth(new Date()), 'dd.MM');
  const progressBarEndDate = format(endOfMonth(new Date()), 'dd.MM');
  const progressBarCurrentDate = format(new Date(), 'dd.MM');
  const currentDay = getDate(new Date());
  const dayOfMonth = getDaysInMonth(new Date());
  const progress = Math.round(currentDay / dayOfMonth * 100);
  const reports = await gApi.getDailyReports(
    format(startOfMonth(new Date()), 'dd.MM.yyyy'),
    format(new Date(), 'dd.MM.yyyy')
  );
  const revenue = reports.reduce((sum, current) => Math.floor(Number(sum) + Number(current.totalSum)), 0);

  const image = await createImageFromHtml({
    ...body,
    expenses: body.expenses.map(item => ({ ...item, title: item.category.title })),
    type: body.type === 'add' ? 'Отчет' : 'Обновление отчета',
    yandex: body.yandex || '0',
    deliveries: filteredDeliveriesData,
    totalDeliveries: total,
    totalDeliveriesSum: totalAmount,
    ...lunchSales[0],
    progressBarStartDate,
    progressBarCurrentDate,
    progressBarEndDate,
    revenue,
    progress: `${progress}%`,
    prepays
  });

  await tbot.sendPhoto(getTelegramChatId("reports"), image, undefined, { contentType: 'image/jpeg' });
};

const receiptsOperationValues = {
  ipCash: { title: 'Поступления наличные средства', type: 'Наличные', comment: 'по ИП' },
  oooCash: { title: 'Поступления наличные средства', type: 'Наличные', comment: 'по ООО' },
};

const transformedDate = (date) => {
  const dateArray = date.split('.');
  const day = Number(dateArray[0]) + 1;
  const month = Number(dateArray[1]) - 1;
  const year = Number(dateArray[2]);
  return new Date(year, month, day);
};

async function getReports(req, res) {
  const { from, to } = req.query;

  let reports;

  try {
    reports = await DailyReportModel.find().sort({ date: 1 });

    if (from) {
      reports = reports.filter(item => isEqual(item.date, transformedDate(from)) || isAfter(item.date, transformedDate(from)));
    }

    if (to) {
      reports = reports.filter(item => isEqual(item.date, transformedDate(to)) || isBefore(item.date, transformedDate(to)));
    }

  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: reports });
}

async function saveReportsToMongo(req, res) {
  try {
    const reports = await gApi.getDailyReports();

    const transformedReports = [];

    for (const report of reports) {
      const expenses = typeof report.expenses === 'object' ? report.expenses : JSON.parse(report.expenses || '')

      transformedReports.push({
        date: new Date(transformedDate(report.date)),
        adminName: report.adminName,
        ipCash: report.ipCash,
        ipAcquiring: report.ipAcquiring,
        oooCash: report.oooCash,
        oooAcquiring: report.oooAcquiring,
        yandex: report.yandex,
        totalSum: report.totalSum,
        totalCash: report.totalCash,
        expenses: expenses.map(expense => ({
          ...expense,
          category: {
            title: expense.category.title,
            icon: expense.category.icon,
            counterpartyType: expense.category.id
          }
        }))
      })
    }

    const newReport = await DailyReportModel.create(transformedReports);

    return res.json({ status: "OK", data: newReport });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
}

async function addReport(req, res) {
  const { body } = req;

  try {
    const newReport = await DailyReportModel.create(body);

    for (const expense of newReport.expenses) {
      await gApi.addFinancialOperation([expense.id, body.date, expense.category.title, 'Наличные', expense.sum.replace('.', ','), expense.counterparty || '', expense.comment || '']);
    }

    for (const receipt of Object.keys(receiptsOperationValues)) {
      const value = receiptsOperationValues[receipt];

      if (body[receipt]) {
        await gApi.addFinancialOperation(['', body.date, value.title, value.type, body[receipt].replace('.', ','), value.counterparty || '', value.comment || '']);
      }
    }

    // await sendReportToTelegram({ ...body, type: 'add' });

    return res.json({ status: 'OK', data: newReport });
  } catch (err) {
    console.log(err, 'err');
    return res.json({ status: 'ERROR', message: err.message });
  }
}

async function updateReport(req, res) {
  const { body } = req;

  try {
    const oldReport = await DailyReportModel.findOne({ _id: req.body.id });
    const newReport = await DailyReportModel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });

    const oldExpenses = oldReport.expenses;
    const operations = await gApi.getFinancialOperations();


    for (const expense of body.expenses) {
      const hasExpense = oldExpenses.find(exp => exp.id === expense.id);
      if (hasExpense) {
        await gApi.updateFinancialOperation(
          expense.id,
          [body.date, expense.category.title, 'Наличные', expense.sum.replace('.', ','), expense.counterparty || '', expense.comment],
          operations
        );
      } else {
        await gApi.addFinancialOperation([expense.id, body.date, expense.category.title, 'Наличные', expense.sum.replace('.', ','), expense.counterparty || '', expense.comment])
      }
    }


    for (const receipt of Object.keys(receiptsOperationValues)) {
      const value = receiptsOperationValues[receipt];
      if (body[receipt]) {
        await gApi.updateFinancialOperation(
          undefined,
          [body.date, value.title, value.type, body[receipt].replace('.', ','), value.counterparty || '', value.comment],
          operations
        );
      }
    }

    const idsToDelete = [];
    oldExpenses.forEach(i => {
      if (!body.expenses.find((j) => j.id === i.id)) {
        idsToDelete.push(i.id);
      }
    })

    if (idsToDelete.length) {
      for (const id of idsToDelete) {
        await gApi.deleteFinancialOperation(id);
      }
    }

    // await sendReportToTelegram({ ...body, type: 'update' });

    return res.json({ status: 'OK', data: newReport });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
}

module.exports = { getReports, addReport, updateReport, saveReportsToMongo };

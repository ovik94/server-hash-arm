const router = require("express").Router();
const gApi = require("../google-client/google-api");
const tbot = require("../telegram-bot/tbot");
const getTelegramChatId = require("../telegram-bot/get-telegram-chat-id");
const createTbotMessage = require('./daily-report/createTbotMessage');
const tbotMessageLunchSales = require('./daily-report/tbotMessageLunchSales');
const tbotMessageDeliveries = require('./daily-report/tbotMessageDeliveries');
const { v4: uuidv4 } = require("uuid");
const { isAfter, isBefore, format } = require('date-fns');
const iikoCloudApi = require("../iiko-cloud/api");
const iikoServerApi = require("../iiko-server/api");

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

router.get("/reports", async function (req, res, next) {
  try {
    const data = await gApi.getDailyReports();
    let result = data.map(item => ({ ...item, expenses: item.expenses ? JSON.parse(item.expenses) : [] }));

    if (req.query.from) {
      result = result.filter(item => {
        if (item.date === req.query.from) {
          return true;
        }
        return isAfter(transformedDate(item.date), transformedDate(req.query.from));
      });
    }

    if (req.query.to) {
      result = result.filter(item => {
        if (item.date === req.query.to) {
          return true;
        }
        return isBefore(transformedDate(item.date), transformedDate(req.query.to));
      });
    }

    return res.json({ status: "OK", data: result });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
});

router.get("/clear", async function (req, res, next) {
  try {
    await gApi.clearReport();
    return res.json({ status: "OK" });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
});

router.post("/add", async function (req, res, next) {
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

    const deliveries = await iikoCloudApi.getDeliveries(`${format(new Date(), 'yyyy-MM-dd')} 00:00:00.123`);
    const deliveryData = { items: [], sumAmount: 0, sumCount: 0 };

    Object.keys(deliveries).forEach(item => {
      const value = deliveries[item];
      const amount = Math.floor(value.reduce((acc, current) => acc + current.sum, 0));
      deliveryData.items.push({
        label: value[0].source?.name,
        count: value.length,
        value: amount
      });
      deliveryData.sumAmount += amount;
      deliveryData.sumCount += value.length;
    });

    const lunchSales = await iikoServerApi.getLunchSales(format(new Date(), 'yyyy-MM-dd'));

    const mainMessage = createTbotMessage(body);
    const deliveryMessage = tbotMessageDeliveries(deliveryData);
    const lunchSalesMessage = tbotMessageLunchSales(lunchSales[0]);
    await tbot.sendMessage(getTelegramChatId("reports"), mainMessage, { parse_mode: 'HTML' });
    await tbot.sendMessage(getTelegramChatId("reports"), deliveryMessage, { parse_mode: 'HTML' });
    await tbot.sendMessage(getTelegramChatId("reports"), lunchSalesMessage, { parse_mode: 'HTML' });
  } catch (err) {
    console.log(err, 'err');
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK', data });
});

router.post("/update", async function (req, res, next) {
  const { body } = req;

  try {
    const reports = await gApi.getDailyReports();
    const oldExpenses = JSON.parse((reports.find(report => report.id === body.id) || {}).expenses || '');
    const operations = await gApi.getFinancialOperations();

    await gApi.updateReport(body);

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

    const message = createTbotMessage(body, 'update');
    await tbot.sendMessage(getTelegramChatId("reports"), message, { parse_mode: 'HTML' });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK' });
});

module.exports = router;

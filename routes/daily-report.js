const router = require("express").Router();
const gApi = require("../google-client/google-api");
const tbot = require("../telegram-bot/tbot");
const getTelegramChatId = require("../telegram-bot/get-telegram-chat-id");
const createTbotMessage = require('./daily-report/createTbotMessage');
const { v4: uuidv4 } = require("uuid");

const receiptsOperationValues = {
  ipCash: { title: 'Поступления наличные средства', type: 'Наличные', comment: 'по ИП' },
  ipAcquiring: { title: 'Эквайринг ИП', type: 'Альфа р/c ИП', counterparty: 'Альфа-Банк' },
  oooCash: { title: 'Поступления наличные средства', type: 'Наличные', comment: 'по ООО' },
  oooAcquiring: { title: 'Эквайринг ООО', type: 'Альфа р/c ООО', counterparty: 'Альфа-Банк' }
};

router.get("/reports", async function (req, res, next) {
  try {
    const data = await gApi.getDailyReports();
    const result = data.map(item => ({ ...item, expenses: item.expenses ? JSON.parse(item.expenses) : [] }));
    return res.json({ status: "OK", data: result });
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

    const message = createTbotMessage(body);
    await tbot.sendMessage(getTelegramChatId("reports"), message, { parse_mode: 'HTML' });
  } catch (err) {
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
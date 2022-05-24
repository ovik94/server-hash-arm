const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");
const tbot = require("../telegram-bot/tbot");
const getTelegramChatId = require("../telegram-bot/get-telegram-chat-id");
const createTbotMessage = require('./daily-report/createTbotMessage');

router.get("/reports", async function (req, res, next) {
  const reports = await gApi.getDailyReports();
  const data = await transformRowsInArray(reports);

  const result = data.map(item => ({ ...item, expenses: item.expenses ? JSON.parse(item.expenses) : [] }));


  return res.json({ status: "OK", data: result });
});

router.post("/add", async function (req, res, next) {
  const { body } = req;
  let resultStatus = 'OK';

  const newReport = await gApi.addReport(body);

  if (!newReport) {
    resultStatus = 'ERROR'
  }

  if (newReport) {
    const message = createTbotMessage(body);
    await tbot.sendMessage(getTelegramChatId("reports"), message, { parse_mode: 'HTML' }).catch((err) => {
      console.log(err, 'err');
      resultStatus = 'ERROR_BOT_SEND_MESSAGE';
    });
  }

  return res.json({ status: resultStatus });
});

router.post("/update", async function (req, res, next) {
  const { body } = req;
  let resultStatus = 'OK';

  const newReport = await gApi.updateReport(body);

  if (!newReport) {
    resultStatus = 'ERROR'
  }

  if (newReport) {
    const message = createTbotMessage(body, 'update');
    await tbot.sendMessage(getTelegramChatId("reports"), message, { parse_mode: 'HTML' }).catch((err) => {
      console.log(err, 'err');
      resultStatus = 'ERROR_BOT_SEND_MESSAGE';
    });
  }

  return res.json({ status: resultStatus });
});

module.exports = router;
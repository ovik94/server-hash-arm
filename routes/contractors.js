const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");
const tbot = require('../telegram-bot/tbot');
const getTelegramChatId = require('../telegram-bot/get-telegram-chat-id');

router.get("/", async function (req, res, next) {
  const data = await gApi.getContractorsData();

  return res.json({ status: "OK", data });
});

router.get("/info", async function (req, res, next) {
  const { query } = req;
  const data = await gApi.getContractorsInfo(query.id);

  return res.json({ status: "OK", data });
});

router.post("/create", async function (req, res, next) {
  const { query, body } = req;

  let sendMessage = '';
  let status = 'OK';

  body.data.forEach((item, index) => {
    sendMessage += `${index + 1}) ${item.title} - ${item.count} ${item.unit} \n`
  });

  tbot.sendMessage(getTelegramChatId(query.id), sendMessage).then(() => {
    status = 'ERROR_BOT_SEND_MESSAGE';
  });

  return res.json({ status });
});


module.exports = router;
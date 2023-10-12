const gApi = require("../src/google-client/google-api");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");

async function getContractors (req, res) {
  const data = await gApi.getContractorsData();

  return res.json({ status: "OK", data });
}

async function getContractorInfo (req, res) {
  const { query } = req;
  const data = await gApi.getContractorsInfo(query.id);

  return res.json({ status: "OK", data });
}

async function createContractor (req, res) {
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
}

module.exports = { getContractors, getContractorInfo, createContractor };

const { format } = require('date-fns');
const router = require("express").Router();
const easyTable = require("easy-table");
const getTelegramChatId = require('../telegram-bot/get-telegram-chat-id');
const tbot = require('../telegram-bot/tbot');

const formatterDate = (date, skeleton) => format(date, skeleton);

router.post("/save", async function (req, res, next) {
  const { body } = req;

  let status = 'OK';

  const menu = [];

  Object.keys(body.menu).forEach(category => {
    menu.push(...body.menu[category]);
  });

  const data = {
    name: body.name,
    phone: body.phone,
    personsCount: body.personsCount,
    date: formatterDate(new Date(body.date), 'dd.MM.yyyy HH:mm'),
    menu,
    sum: body.sum,
    totalAmount: body.totalAmount,
    admin: body.admin
  }

  if (body.sale) {
    data.sale = body.sale;
  }

  if (body.serviceFee) {
    data.serviceFee = body.serviceFee;
  }

  const table = new easyTable();

  if (data.menu.length > 0) {
    data.menu.forEach((item, index) => {
      table.cell("Название", item.title, easyTable.string());
      table.cell("Цена", item.price, easyTable.string());
      table.cell("Кол-во", item.count, easyTable.string());
      table.cell("Вес", item.weight, easyTable.string());
      table.newRow();
    });
  }

  const message = `<b>Резерв банкета. Принял адмимнистратор ${data.admin}</b>
<i>Имя: ${data.name}</i>
<i>Номер телефона: ${data.phone}</i>
<i>Количество гостей: ${data.personsCount}</i>
<i>Дата: ${data.date}</i>
<pre>${table.toString()}</pre>
`;

  await tbot.sendMessage(
    getTelegramChatId("banquets"),
    message,
    { parse_mode: 'HTML' }
  ).catch(() => {
    status = 'ERROR_BOT_SEND_MESSAGE';
  });

  return res.json({ status });
});

module.exports = router;
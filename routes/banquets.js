const { format } = require('date-fns');
const router = require("express").Router();
const easyTable = require("easy-table");
const getTelegramChatId = require('../telegram-bot/get-telegram-chat-id');
const tbot = require('../telegram-bot/tbot');

const formatterDate = (date, skeleton) => format(date, skeleton);

router.post("/save", async function (req, res, next) {
  const { body } = req;

  let status = 'OK';

  const transformedMenu = [];

  body.menu.forEach(menuGroup => {
    menuGroup.items.forEach(menuItem => transformedMenu.push({
      title: menuItem.name,
      price: menuItem.price,
      count: menuItem.count
    }))
  });

  const data = {
    ...body,
    date: formatterDate(new Date(body.date), 'dd.MM.yyyy HH:mm'),
    menu: transformedMenu
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
      table.newRow();
    });
  }

  let message = `<b>Резерв банкета. Принял адмимнистратор ${data.admin}</b>
Имя: <i>${data.name}</i>
Номер телефона: <i>${data.phone}</i>
Количество гостей: <i>${data.personsCount}</i>
Дата: <i>${data.date}</i>

<pre>${table.toString()}</pre>
Сумма заказа: <b>${data.sum}</b> ₽`;

  if (data.sale) {
    message += `
Скидка: <b>${data.sale}%</b>`;
  }

  if (data.serviceFee) {
    message += `
Процент за обслуживание: <b>${data.serviceFee}%</b>`;
  }

  message += `

Итого: <strong>${data.totalAmount} ₽</strong>`;

  await tbot.sendMessage(
    getTelegramChatId("test"),
    message,
    { parse_mode: 'HTML' }
  ).catch(() => {
    status = 'ERROR_BOT_SEND_MESSAGE';
  });

  return res.json({ status });
});

module.exports = router;

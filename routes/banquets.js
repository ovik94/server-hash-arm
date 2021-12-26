const { format } = require('date-fns');
const router = require("express").Router();
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const getTelegramChatId = require('../telegram-bot/get-telegram-chat-id');
const tbot = require('../telegram-bot/tbot');

const options = {
  format: "A4",
  orientation: "portrait",
  border: "10mm"
};

const formatterDate = (date, skeleton) => format(date, skeleton);

router.post("/save", async function (req, res, next) {
  const { body } = req;

  let status = 'OK';

  const html = fs.readFileSync(path.resolve(__dirname, './templates/banquet.html'), 'utf8');

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

  const filename = `${body.name}-${formatterDate(new Date(body.date), 'dd.MM.yyyy')}.pdf`;
  const document = {
    html: html,
    data,
    path: `./${filename}`,
    type: "buffer",
  };

  pdf
    .create(document, options)
    .then((res) => {
      tbot.sendDocument(getTelegramChatId('banquets'), res, {}, { filename }).then(() => {
        status = 'ERROR_BOT_SEND_MESSAGE';
      });
    })
    .catch((error) => {
      status = 'ERROR_CREATE_PDF';
    });


  return res.json({ status });
});

module.exports = router;
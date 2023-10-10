const { format } = require('date-fns');
const router = require("express").Router();
const getTelegramChatId = require('../telegram-bot/get-telegram-chat-id');
const tbot = require('../telegram-bot/tbot');
const { createImageFromHtml } = require("../create-image-from-html/create-image-from-html");

const formatterDate = (date, skeleton) => format(date, skeleton);

router.post("/save", async function (req, res, next) {
  const { body } = req;

  try {
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

    const image = await createImageFromHtml(data, 'BANQUET');
    await tbot.sendPhoto(getTelegramChatId("banquets"), image, undefined, { contentType: 'image/jpeg' });

    return res.json({ status });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
});

module.exports = router;

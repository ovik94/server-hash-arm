const { format } = require("date-fns");
const { createImageFromHtml } = require("../src/create-image-from-html/create-image-from-html");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");

async function saveBanquet (req, res) {
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
      date: format(new Date(body.date), 'dd.MM.yyyy HH:mm'),
      menu: transformedMenu
    }

    const image = await createImageFromHtml(data, 'BANQUET');
    await tbot.sendPhoto(getTelegramChatId("banquets"), image, undefined, { contentType: 'image/jpeg' });

    return res.json({ status });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
}

module.exports = { saveBanquet };

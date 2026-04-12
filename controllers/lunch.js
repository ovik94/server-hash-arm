const moment = require("moment");
const maxbot = require("../src/max-bot/max-bot");
const getMaxChatId = require("../src/max-bot/get-max-chat-id");
const axios = require("axios");

const getWeekNumber = () => {
  const week = moment().isoWeek();
  const day = moment().isoWeekday();
  const holiday = day === 6 || day === 7;
  const weekNumber = (week % 4) === 3 ? 0 : (week % 4) + 1;
  return { weekNumber, isHoliday: holiday };
};

async function getLunchWeek(req, res) {
  return res.json({ status: "OK", data: getWeekNumber() });
}

async function sendLunchTelegram(req, res) {
  const images = [
    'RRF/a+25MDjppMsrYcf6Gw4nDH7+we0Cs9qRIJJwnFIKXCKJjVabjvWwt+H5I0+VZo6CuhBmcYm2QAwEXfuosroom8nNSsO5YiMz57eNi3Tfm4vGi6+nETU2escO8ff0', // куриный, базук 4
    'qPJJ0AhnPrNK4B2EcXxbsEmxehEboRvLdBCrHpXvD0sLJih6RDtY1UV8sW6cP7ms84e6BbFMtSbEULsAk4ZmWrzrZcnZ4aYIiDm9wn4g6YlejS2a13aXFBifNa6wuFjA', // по корейски, греческий 1
    'oLx7pxXAqbg+l+yW5I8haHiaPQBAsfPP9cQQ1OsXy7qL4mZe7U0XNVQc4IUxQDvYj46V0XHfnInz/NBI3Gl8wPkRCWWCyHyer9zk1gRgCMmK7b/iBuRp0gVO6TNYU6BR', // армения, оливье 2
    'F4ac7w5am1CANRGL94HSSxwZ0xBQa9zOOQshWI55igPs9sykj7yp2LXTEoMmJe2c/2DBs+cWGsHdcxdgGqA8qU0bettaQ9TN8S0r4ulVRyQUs7FFJRCc4mvQ01s1fwlb', // блинный, винегрет 3
  ];

  const week = getWeekNumber();
  const day = moment().isoWeekday();

  if (day === 1) {
    await maxbot.sendMessage(getMaxChatId("channel"), `
Новый бизнес-ланч в ХашЛаваш 🍽️

С понедельника по пятницу, с 12:00 до 15:00, у нас можно пообедать сытно, вкусно и без суеты. Мы обновили ланч — каждую неделю новое меню, чтобы вы могли пробовать разные блюда и не повторяться.

Теперь бизнес-ланч можно заказать на нашем сайте — быстро, удобно и без лишних действий.

[Заказать](https://hash-lavash.ru/berdsk/biznes-lanch)
    `, { parse_mode: 'Markdown' })

    await maxbot.sendPhoto(
      getMaxChatId("channel"),
      images[week.weekNumber]
    );
  }

  return res.json({ status: "OK" });
}

async function sendLunchVk(req, res, next) {
  const images = [
    "photo-211214337_457245685", // куриный, базук
    "photo-211214337_457245686", // по корейски, греческий
    "photo-211214337_457245688", // армения, оливье
    "photo-211214337_457245687", // блинный, винегрет
  ];

  const week = getWeekNumber();
  const day = moment().isoWeekday();

  let status = "OK";

  if (day === 1) {
    axios.post(
      "https://broadcast.vkforms.ru/api/v2/broadcast?token=api_87768_YKQjQvoekX1ri4HGHKYRG4Wi",
      {
        message: {
          message: "Новый бизнес-ланч в ХашЛаваш 🍽️\n\nС понедельника по пятницу, с 12:00 до 15:00, у нас можно пообедать сытно, вкусно и без суеты. Мы обновили ланч — каждую неделю новое меню, чтобы вы могли пробовать разные блюда и не повторяться.\n\nТеперь бизнес-ланч можно заказать на нашем сайте — быстро, удобно и без лишних действий.\n\nhttps://hash-lavash.ru",
          attachment: images[week.weekNumber],
        },
        list_ids: "1179243",
        run_now: 1,
      }
    ).then(function (response) {
      console.log("Рассылка отправлена");
    }).catch(function (error) {
      console.log(error, "Ошибка при отправке рассылки");
      status = "ERROR";
    });
  }

  return res.json({ status });
}

module.exports = { sendLunchTelegram, sendLunchVk, getLunchWeek };

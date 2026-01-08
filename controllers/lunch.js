const moment = require("moment");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
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
    'AgACAgIAAxkBAAIFuWklHuRpl9HMuaLK6M5BGXjZguHcAAIVC2sbrQMxSec1HxL-mJ8VAQADAgADeAADNgQ', // куриный, базук 4
    'AgACAgIAAxkBAAIFumklHxFrIa-YE5hLCdZW1JhE9IdbAAIWC2sbrQMxSfF-2OitDe4mAQADAgADeAADNgQ', // по корейски, греческий 1
    'AgACAgIAAxkBAAIFvGklHzX4wfLL9Jg2_V_G8ZaYmMAIAAIYC2sbrQMxSdtDntclh6bdAQADAgADeAADNgQ', // армения, оливье 2
    'AgACAgIAAxkBAAIFu2klHyLfVALUkJxp5pSW9GrKFbuSAAIXC2sbrQMxSYBcm5JOi37eAQADAgADeAADNgQ', // блинный, винегрет 3
  ];

  const week = getWeekNumber();
  const day = moment().isoWeekday();

  if (day === 1) {
    await tbot.sendMessage(getTelegramChatId("channel"), `
Новый бизнес-ланч в ХашЛаваш 🍽️

С понедельника по пятницу, с 12:00 до 15:00, у нас можно пообедать сытно, вкусно и без суеты. Мы обновили ланч — каждую неделю новое меню, чтобы вы могли пробовать разные блюда и не повторяться.

Теперь бизнес-ланч можно заказать на нашем сайте — быстро, удобно и без лишних действий.

[Заказать](https://hash-lavash.ru/berdsk/biznes-lanch)
    `, { parse_mode: 'Markdown' })

    await tbot.sendPhoto(
      getTelegramChatId("channel"),
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

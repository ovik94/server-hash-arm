import moment from "moment";
import axios from "axios";
import { getTelegramChatId, tbot } from "../lib/telegram-bot";

export const getWeekNumber = () => {
  const week = moment().isoWeek();
  const day = moment().isoWeekday();
  const holiday = day === 6 || day === 7;
  const weekNumber = week % 4 === 3 ? 0 : (week % 4) + 1;
  return { weekNumber, isHoliday: holiday };
};

export async function sendLunchTelegram() {
  const images = [
    "AgACAgIAAxkBAAIFuWklHuRpl9HMuaLK6M5BGXjZguHcAAIVC2sbrQMxSec1HxL-mJ8VAQADAgADeAADNgQ", // куриный, базук 4
    "AgACAgIAAxkBAAIFumklHxFrIa-YE5hLCdZW1JhE9IdbAAIWC2sbrQMxSfF-2OitDe4mAQADAgADeAADNgQ", // по корейски, греческий 1
    "AgACAgIAAxkBAAIFvGklHzX4wfLL9Jg2_V_G8ZaYmMAIAAIYC2sbrQMxSdtDntclh6bdAQADAgADeAADNgQ", // армения, оливье 2
    "AgACAgIAAxkBAAIFu2klHyLfVALUkJxp5pSW9GrKFbuSAAIXC2sbrQMxSYBcm5JOi37eAQADAgADeAADNgQ", // блинный, винегрет 3
  ];

  const week = getWeekNumber();
  const day = moment().isoWeekday();

  if (day === 1) {
    await tbot.sendMessage(
      getTelegramChatId("channel"),
      `
 Дорогие гости!

 Мы решили обновить наш интерьер, поэтому сейчас мы бросаем все силы на то, чтобы вскоре встретить вас в обновленном пространстве.
 Ресторан «ХашЛаваш» будет закрыт на ремонт с 19.01.2025 года.
 Вы можете заказать свои любимые блюда на доставку или самовывоз
 www.hash-lavash.ru
 +7-960-795-96-33
    `,
      { parse_mode: "Markdown" }
    );

    // Оригинальная логика с картинками сохранена в комментариях
    // await tbot.sendPhoto(
    //   getTelegramChatId("channel"),
    //   images[week.weekNumber]
    // );
  }
}

export async function sendLunchVk() {
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
    await axios
    .post(
      "https://broadcast.vkforms.ru/api/v2/broadcast?token=api_87768_YKQjQvoekX1ri4HGHKYRG4Wi",
      {
        message: {
          // message: "Новый бизнес-ланч в ХашЛаваш 🍽️\n\nС понедельника по пятницу, с 12:00 до 15:00, у нас можно пообедать сытно, вкусно и без суеты. Мы обновили ланч — каждую неделю новое меню, чтобы вы могли пробовать разные блюда и не повторяться.\n\nТеперь бизнес-ланч можно заказать на нашем сайте — быстро, удобно и без лишних действий.\n\nhttps://hash-lavash.ru",
          message:
            "Дорогие гости!\n\n Мы решили обновить наш интерьер, поэтому сейчас мы бросаем все силы на то, чтобы вскоре встретить вас в обновленном пространстве.\n Ресторан «ХашЛаваш» будет закрыт на ремонт с 19.01.2025 года.\n Вы можете заказать свои любимые блюда на доставку или самовывоз\n www.hash-lavash.ru\n +7-960-795-96-33",
          // attachment: images[week.weekNumber],
        },
        list_ids: "1179243",
        run_now: 1,
      }
    )
    .then(function () {
      // eslint-disable-next-line no-console
      console.log("Рассылка отправлена");
    })
    .catch(function (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, "Ошибка при отправке рассылки");
      status = "ERROR";
    });
  }

  return status;
}


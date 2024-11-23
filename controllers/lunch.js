const moment = require("moment");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const axios = require("axios");

const getWeekNumber = () => {
  const week = moment().isoWeek();
  const day = moment().isoWeekday();
  const holiday = day === 6 || day === 7;
  return { weekNumber: (week % 4) + 1, isHoliday: holiday };
};

async function getLunchWeek(req, res) {
  return res.json({ status: "OK", data: getWeekNumber() });
}

async function sendLunchTelegram(req, res) {
  const images = {
    2: [
      // 2 неделя
      "AgACAgIAAxkBAAIE_2c7e4-0wnoda5jngvuWvMGngaTCAAJC6TEbG0HYSddJfLSNEf8CAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIFAAFnO3uk7dJ-MEfHQcHDogABq93i3-oAAkPpMRsbQdhJNh6V6gXzKPkBAAMCAAN3AAM2BA",
      "AgACAgIAAxkBAAIFAWc7e7d0WKLpqTkSQiarJJv_RID_AAJE6TEbG0HYSd58HpnV0iTRAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIFAmc7e8U8Dp9qz1K7-HiBqjP3K0ekAAJF6TEbG0HYSUOsofP4RqLnAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIFA2c7e9Z6MrAsZwxKmN1epV-dEmY3AAJH6TEbG0HYSZG9TQQb2M6FAQADAgADdwADNgQ",
    ],
    3: [
      // 3 неделя
      "AgACAgIAAxkBAAIE8Gc7edq9EIxXl2qz51DXOLGnrJbjAAIx6TEbG0HYSR3l_xG4Pm4hAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE8Wc7egKP9QOkbBmlsxGaRgs5OqB6AAIy6TEbG0HYSYmTxnk_WEHqAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE8mc7ehKzzXSgbBscbA6z-c3-Y0eeAAI26TEbG0HYSd4_Rl0fxhOGAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE82c7eiMw0qHFku4wqnPTzTRLmKhDAAI36TEbG0HYSe2-Hg8SbmwgAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE9Gc7elgM1SxFajKrRxH1bnFSLCLuAAI46TEbG0HYSWiulPrBGgK_AQADAgADdwADNgQ",
    ],
    4: [
      // 4 неделя
      "AgACAgIAAxkBAAIE9Wc7eoUohNY7V1zG7YEI0KqdoAoyAAI66TEbG0HYSYGF65UKefqNAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE9mc7epsE2467sO1ZLhR94z2k3h0UAAI76TEbG0HYScNLk_Ou8_0qAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE8mc7ehKzzXSgbBscbA6z-c3-Y0eeAAI26TEbG0HYSd4_Rl0fxhOGAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE82c7eiMw0qHFku4wqnPTzTRLmKhDAAI36TEbG0HYSe2-Hg8SbmwgAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE9Gc7elgM1SxFajKrRxH1bnFSLCLuAAI46TEbG0HYSWiulPrBGgK_AQADAgADdwADNgQ",
    ],
    1: [
      // 1 неделя
      "AgACAgIAAxkBAAIE9Wc7eoUohNY7V1zG7YEI0KqdoAoyAAI66TEbG0HYSYGF65UKefqNAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE9mc7epsE2467sO1ZLhR94z2k3h0UAAI76TEbG0HYScNLk_Ou8_0qAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE_Gc7e2MZLCk3fRaHVJg0i2buG9PTAAI_6TEbG0HYSdwzRy0-Pl44AQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE_Wc7e3GmZKhOwZrSiBSsJ0H_S4YzAAJA6TEbG0HYSe2FlsQroyCMAQADAgADdwADNgQ",
      "AgACAgIAAxkBAAIE_mc7e39Ljdq-i4AK4LHO4vPI2ZLjAAJB6TEbG0HYSUQqXVJLzzDRAQADAgADdwADNgQ",
    ],
  };

  const week = getWeek();
  const day = moment().isoWeekday();

  if (!week.isHoliday) {
    await tbot.sendPhoto(
      getTelegramChatId("channel"),
      images[week.weekNumber % 4][day - 1]
    );
  }

  return res.json({ status: "OK" });
}

async function sendLunchVk(req, res, next) {
  const images = {
    2: [
      // 2 неделя
      "photo-211214337_457244379",
      "photo-211214337_457244378",
      "photo-211214337_457244381",
      "photo-211214337_457244382",
      "photo-211214337_457244380",
    ],
    3: [
      // 3 неделя
      "photo-211214337_457244364",
      "photo-211214337_457244363",
      "photo-211214337_457244366",
      "photo-211214337_457244367",
      "photo-211214337_457244365",
    ],
    4: [
      // 4 неделя
      "photo-211214337_457244369",
      "photo-211214337_457244368",
      "photo-211214337_457244371",
      "photo-211214337_457244372",
      "photo-211214337_457244370",
    ],
    1: [
      // 1 неделя
      "photo-211214337_457244374",
      "photo-211214337_457244373",
      "photo-211214337_457244376",
      "photo-211214337_457244377",
      "photo-211214337_457244375",
    ],
  };

  const week = getWeek();
  const day = moment().isoWeekday();

  let status = "OK";

  if (!week.isHoliday) {
    axios
      .post(
        "https://broadcast.vkforms.ru/api/v2/broadcast?token=api_87768_YKQjQvoekX1ri4HGHKYRG4Wi",
        {
          message: {
            message: "Меню бизнес-ланча на сегодня",
            attachment: images[week.weekNumber % 4][day - 1],
          },
          list_ids: "1179243",
          run_now: 1,
        }
      )
      .then(function (response) {
        console.log("Рассылка отправлена");
      })
      .catch(function (error) {
        console.log(error, "Ошибка при отправке рассылки");
        status = "ERROR";
      });
  }

  return res.json({ status });
}

module.exports = { sendLunchTelegram, sendLunchVk, getLunchWeek };

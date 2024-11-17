const moment = require("moment");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const axios = require("axios");

async function sendLunchTelegram(req, res) {
  const images = {
    1: [
      "AgACAgIAAxkBAAIEkGWabJG_a32JLsvZaR736DgpSIcgAAJn0zEbGr3YSCa570T22HnxAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEkWWabLIMVOMle878XQ7d1BOT0MxHAAJp0zEbGr3YSHamOK1A3jOCAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEkmWabMPmb7a6uGFOSz2yLaCh5C3gAAJq0zEbGr3YSBnoMVONVzLJAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEk2WabNh2-PyCDNZpxzNjqNgPTpamAAJr0zEbGr3YSEz9VTPbBswdAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIElGWabOjuZl5fNVWJ91RueR7Ts1IPAAJt0zEbGr3YSHD1-dE_FycRAQADAgADeQADNAQ",
    ],
    2: [
      "AgACAgIAAxkBAAIEgWWaauwQPvGfZVAq8fJc3HyxNk1VAAJP0zEbGr3YSAbOL5_eCGpHAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEgmWaayKD75ZoMF4qBGOyZ23HFU1vAAJT0zEbGr3YSMhYAAFBuPvY6AEAAwIAA3kAAzQE",
      "AgACAgIAAxkBAAIEg2WaazT5HaVk4njJXLQa9YfTB3NdAAJU0zEbGr3YSCDNKqj3DVyNAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEhGWaa0_YFVcUXCQmFcKm0eNIvPHFAAJZ0zEbGr3YSAQkYZTMfpbzAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEhWWaa5v5o4B-JLcgwkG3nNMkUI1UAAJa0zEbGr3YSLjTz5m6lP-AAQADAgADeQADNAQ",
    ],
    3: [
      "AgACAgIAAxkBAAIEhmWaa7XKama0EAJEYfbPHRq4n-0vAAJb0zEbGr3YSOoisFcHsFcuAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEh2Waa83DbFeUaL4Hkxx3offZWf7_AAJd0zEbGr3YSIvwPvGq3vfiAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEiGWaa-oNjtdlwup3gK5XzW6foXGSAAJe0zEbGr3YSAUqtNNR6fTtAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEiWWabBL37nJgjtujOMSRqz1IrPK-AAJf0zEbGr3YSMHgVQ0D4PzvAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEimWabCVdhWMgPDKlY-DAtI5O-7CoAAJg0zEbGr3YSDXVYdsxzwoaAQADAgADeQADNAQ",
    ],
    0: [
      "AgACAgIAAxkBAAIEi2WabDuhFZaaaTstO9LBeSrMPPrrAAJh0zEbGr3YSG7Kze1zAsYGAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEjGWabEy4qt1njEmpoDarS8v7CHeGAAJi0zEbGr3YSJXTrvzNnSN9AQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEjWWabF_u44gpRWsiaj9FqbR2RJZoAAJj0zEbGr3YSPAmWc1Pb4K2AQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEjmWabHLoelG_x7XNc8Sdse7VGSEtAAJk0zEbGr3YSL74D58GXguEAQADAgADeQADNAQ",
      "AgACAgIAAxkBAAIEj2WabIJornQ2WJu7MKhmP6Qd_W_wAAJl0zEbGr3YSDoso0hUoOb4AQADAgADeQADNAQ",
    ],
  };

  const week = moment().isoWeek();
  const day = moment().isoWeekday();
  const holiday = day === 6 || day === 7;

  if (!holiday) {
    await tbot.sendMessage(
      getTelegramChatId("test"),
      `Меню бизнес-ланча на сегодня. Цены на фото не актуальны! 
    Салат-140р
    Суп-180р
    Горячее-240р`
    );
    await tbot.sendPhoto(
      getTelegramChatId("channel"),
      images[week % 4][day - 1]
    );
  }

  return res.json({ status: "OK" });
}

async function sendLunchVk(req, res, next) {
  const images = {
    1: [
      "photo-211214337_457243149",
      "photo-211214337_457243148",
      "photo-211214337_457243151",
      "photo-211214337_457243152",
      "photo-211214337_457243150",
    ],
    2: [
      // 1 неделя
      "photo-211214337_457243134",
      "photo-211214337_457243133",
      "photo-211214337_457243136",
      "photo-211214337_457243137",
      "photo-211214337_457243135",
    ],
    3: [
      "photo-211214337_457243139",
      "photo-211214337_457243138",
      "photo-211214337_457243141",
      "photo-211214337_457243142",
      "photo-211214337_457243140",
    ],
    0: [
      "photo-211214337_457243144",
      "photo-211214337_457243143",
      "photo-211214337_457243146",
      "photo-211214337_457243147",
      "photo-211214337_457243145",
    ],
  };

  const week = moment().isoWeek();
  const day = moment().isoWeekday();
  const holiday = day === 6 || day === 7;
  let status = "OK";

  if (!holiday) {
    axios
      .post(
        "https://broadcast.vkforms.ru/api/v2/broadcast?token=api_87768_YKQjQvoekX1ri4HGHKYRG4Wi",
        {
          message: {
            message:
              "Меню бизнес-ланча на сегодня. Цены на фото не актуальны! Салат-140р | Суп-180р | Горячее-240р",
            attachment: images[week % 4][day - 1],
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

module.exports = { sendLunchTelegram, sendLunchVk };

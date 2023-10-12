const moment = require("moment");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const axios = require("axios");

async function sendLunchTelegram (req, res) {
  const images = {
    1: [
      'AgACAgIAAxkBAAIBamIfN_6PmOKI51fI0cbKR3w2i-lTAALKtzEbblr4SA1nwCS7hlcxAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBa2IfOAn91PC3qFU_TO9PpV03ed74AALLtzEbblr4SNkYWHMJTD94AQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBbGIfOBQwfuvBo3MiqXJSX4TEwguvAALMtzEbblr4SOiTB_1n7bHCAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBbWIfOBxshXbRrECb6chbWV41EhbYAALNtzEbblr4SMW1PETv9TjiAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBbmIfOCU1YmvEtJ8anmYqtdOqKbBTAALPtzEbblr4SK-jA6TOJXQNAQADAgADeQADIwQ'
    ],
    2: [
      'AgACAgIAAxkBAAIBW2IfNNu966PCzluhe5Tnz4kyVgi3AAKwtzEbblr4SMA3Z5u7OohiAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBXGIfNx7sMRNWS3oWS2DgyPlUTrIPAAJvuTEb-5b4SAAB_a0S7NaxGwEAAwIAA3kAAyME',
      'AgACAgIAAxkBAAIBXWIfNzeASHrorwsmphxYnlRO6-LLAAKytzEbblr4SAz8kPicXHrwAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBXmIfN0vcwlo6riWSzEPX1qC9hqKMAAKztzEbblr4SG-rmpbx5xcVAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBX2IfN16mgTzto8fNdyZCjzLArI-4AAK1tzEbblr4SO2zRgQMvU7-AQADAgADeQADIwQ'
    ],
    3: [
      'AgACAgIAAxkBAAIBYGIfN4N4vQa4NTYmMCKequsaTEQGAAK2tzEbblr4SMNWgunFjhl9AQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBYWIfN47htKjtxsAEbJguo3IkaSSoAAK3tzEbblr4SP2yRrHhw72SAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBYmIfN5c4bufQJT7dQOe3eR4XG5CPAAK4tzEbblr4SLBTOqQqZ7aUAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBY2IfN6jsoW3Fj6GninpzbPf5thrBAALDtzEbblr4SDPOKH22YVluAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBZGIfN7F3swn3MC_7bPna5uEQicLrAALEtzEbblr4SDIRsGkOGkxnAQADAgADeQADIwQ'
    ],
    0: [
      'AgACAgIAAxkBAAIBZWIfN8RhnQNL7p8uDgFbxSgCkRinAALFtzEbblr4SKPe-reZNPCLAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBZmIfN9OCKiCX84JrektwdBPb3NtFAALGtzEbblr4SNRcmC1iA5EdAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBZ2IfN931_KDOuUR0a07sm6muGqKEAALHtzEbblr4SL5MaGeaKa-ZAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBaGIfN-aU_rJgKhlQHBZnTG--REWWAALItzEbblr4SIQ85VZoPYibAQADAgADeQADIwQ',
      'AgACAgIAAxkBAAIBaWIfN_J6bs4QtVt320FYtmuDvXbdAALJtzEbblr4SLzf9G2rL4_TAQADAgADeQADIwQ'
    ]
  };

  const week = moment().week();
  const day = moment().day();
  const holiday = day === 6 || day === 7;

  if (!holiday) {
    await tbot.sendPhoto(getTelegramChatId("channel"), images[week % 4][day - 1]);
  }

  return res.json({ status: "OK" });
}

async function sendLunchVk(req, res, next) {
  const images = {
    1: [
      'photo-211214337_457241017',
      'photo-211214337_457241016',
      'photo-211214337_457241019',
      'photo-211214337_457241020',
      'photo-211214337_457241018'
    ],
    2: [
      'photo-211214337_457241002',
      'photo-211214337_457241001',
      'photo-211214337_457241004',
      'photo-211214337_457241005',
      'photo-211214337_457241003'
    ],
    3: [
      'photo-211214337_457241007',
      'photo-211214337_457241006',
      'photo-211214337_457241009',
      'photo-211214337_457241010',
      'photo-211214337_457241008'
    ],
    0: [
      'photo-211214337_457241012',
      'photo-211214337_457241011',
      'photo-211214337_457241014',
      'photo-211214337_457241015',
      'photo-211214337_457241013'
    ]
  }

  const week = moment().week();
  const day = moment().day();
  const holiday = day === 6 || day === 7;
  let status = 'OK';

  if (!holiday) {
    axios.post('https://broadcast.vkforms.ru/api/v2/broadcast?token=api_87768_YKQjQvoekX1ri4HGHKYRG4Wi', {
      message: {
        message: 'Меню бизнес-ланча на сегодня',
        attachment: images[week % 4][day - 1]
      },
      list_ids: '1179243',
      run_now: 1,
    })
      .then(function (response) {
        console.log('Рассылка отправлена');
      })
      .catch(function (error) {
        console.log(error, 'Ошибка при отправке рассылки');
        status = 'ERROR';
      });
  }

  return res.json({ status });
}

module.exports = { sendLunchTelegram, sendLunchVk };

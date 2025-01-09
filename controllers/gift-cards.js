const { format } = require("date-fns");
const GiftCardsModel = require("../model/giftCards");
const {
  createImageFromHtml,
} = require("../src/create-image-from-html/create-image-from-html");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");

async function getList(req, res) {
  try {
    const gitfCards = await GiftCardsModel.find(
      req.query.nominal ? { value: req.query.nominal } : undefined
    );

    return res.json({ status: "OK", data: gitfCards });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function add(req, res) {
  try {
    const count = req.body.count;
    const start = req.body.start;
    const nominal = req.body.nominal;

    const values = Array.from({ length: count }, (_, i) => {
      const code = Math.floor(Math.random() * 100000);
      return {
        value: nominal,
        number: start + i,
        status: "NOT_ACTIVATED",
        code,
      };
    });

    const data = await GiftCardsModel.insertMany(values);

    return res.json({ status: "OK", data });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

async function activate(req, res) {
  try {
    await GiftCardsModel.updateOne(
      { number: req.body.number },
      { status: "ACTIVATED", activationDate: format(new Date(), "dd.MM.yyyy") }
    );
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const updatedCard = await GiftCardsModel.findOne({ number: req.body.number });

  return res.json({ status: "OK", data: updatedCard });
}

async function sendImage(req, res) {
  let image;

  try {
    const number = req.body.number;
    const card = await GiftCardsModel.findOne({ number: req.body.number });
    if (card.status === "NOT_ACTIVATED") {
      return res.json({
        status: "ERROR",
        message: "Подарочная карта не активирована",
      });
    }

    image = await createImageFromHtml(
      { number, nominal: card.value, code: card.code },
      "GIFT_CARDS",
      { selector: ".root" }
    );

    await tbot.sendPhoto(getTelegramChatId("giftCards"), image, undefined, {
      contentType: "image/jpeg",
    });
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  res.writeHead(200, { "Content-Type": "image/png" });
  return res.end(image, "binary");
}

module.exports = { getList, add, activate, sendImage };

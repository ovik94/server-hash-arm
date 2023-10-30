const { format } = require("date-fns");
const { createImageFromHtml } = require("../src/create-image-from-html/create-image-from-html");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const BanquetsModel = require("../model/banquets");

const transformedData = (data) => {
  const transformedMenu = [];

  data.menu.forEach(menuGroup => {
    menuGroup.items.forEach(menuItem => transformedMenu.push({
      title: menuItem.name,
      price: menuItem.price,
      count: menuItem.count
    }));
  });

  return {
    ...data,
    date: format(new Date(data.date), 'dd.MM.yyyy HH:mm'),
    menu: transformedMenu
  }
}
async function saveBanquet (req, res) {
  const { body } = req;

  try {
    let status = 'OK';

    const newBanquetReserve = new BanquetsModel(body);

    await newBanquetReserve.save();

    const image = await createImageFromHtml(transformedData({ ...body, title: 'Новый резерв банкета' }), 'BANQUET');
    await tbot.sendPhoto(getTelegramChatId("banquets"), image, undefined, { contentType: 'image/jpeg' });

    const allReserves =  await BanquetsModel.find();

    return res.json({ status, data: allReserves });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
}

async function editBanquet (req, res) {
  const { body } = req;

  try {
    await BanquetsModel.deleteOne({ _id: body.id });

    const newReserve = { ...body };
    delete newReserve.id;
    const newBanquetReserve = new BanquetsModel(newReserve);
    await newBanquetReserve.save();

    const image = await createImageFromHtml(transformedData({ ...body, title: 'Обновление резерва банкета' }), 'BANQUET');
    await tbot.sendPhoto(getTelegramChatId("banquets"), image, undefined, { contentType: 'image/jpeg' });

  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const allReserves = await BanquetsModel.find();

  return res.json({ status: "OK", data: allReserves });

}

async function deleteBanquet (req, res) {
  try {
    await BanquetsModel.deleteOne({ _id: req.body.id });
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const allReserves = await BanquetsModel.find();

  return res.json({ status: "OK", data: allReserves });
}

async function getBanquetReserve (req, res) {
  let reserve;

  try {
    reserve = await BanquetsModel.findById(req.query.id);
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  if (reserve) {
    return res.json({ status: "OK", data: reserve });
  } else {
    return res.json({ status: "RESERVE_NOT_FOUND" });
  }
}

async function getBanquetReservesList (req, res) {
  let reserves = [];

  try {
    reserves = await BanquetsModel.find();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: reserves });
}

module.exports = {
  saveBanquet,
  getBanquetReservesList,
  getBanquetReserve,
  editBanquet,
  deleteBanquet,
};

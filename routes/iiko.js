const router = require("express").Router();
const iikoWebApi = require("../iiko-web/api");
const tbot = require('../telegram-bot/tbot');
const getTelegramChatId = require('../telegram-bot/get-telegram-chat-id');
const allowedAmounts = require('../routes/iiko-data/allowed-amounts-bar');

router.get("/bar-balance", async function (req, res, next) {
  const productsBalance = await iikoWebApi.getBarBalance();

  const filteredProduct = productsBalance.filter(product => product.product.categoryName === 'Напитки' ||
    product.product.categoryName === 'Крепкий Алкоголь');

  const transformData = filteredProduct.map(item => ({
    name: item.product.name,
    category: item.product.categoryName,
    unit: item.product.mainUnitName,
    balance: item.amount
  }));

  const data = [];

  for (const product of transformData) {
    for (const item of allowedAmounts) {
      if (item.names.includes(product.name)) {
        if (product.balance < item.minBalance) {
          data.push(product);
          break;
        }
      }
    }
  }


  if (data.length > 0) {
    let message = '';
    data.forEach((item, index) => {
      message += `${index+ 1}) ${item.name} осталось ${item.balance} ${item.unit} \n`;
    })

    await tbot.sendMessage(getTelegramChatId('balance'), message)
  }

  return res.json({ status: "OK", data });
});

module.exports = router;
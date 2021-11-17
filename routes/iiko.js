const router = require("express").Router();
const iikoWebApi = require("../iiko-web/api");
const tbot = require("../telegram-bot/tbot");
const getTelegramChatId = require("../telegram-bot/get-telegram-chat-id");
const allowedAmounts = require("../routes/iiko-data/allowed-amounts-bar");
const easyTable = require("easy-table");

router.get("/bar-balance", async function (req, res, next) {
  const productsBalance = await iikoWebApi.getBarBalance();

  const filteredProduct = productsBalance.filter(
    (product) => product.product.categoryName === "Напитки" || product.product.categoryName === "Крепкий Алкоголь"
  );

  const transformData = filteredProduct.map((item) => ({
    name: item.product.name,
    category: item.product.categoryName,
    unit: item.product.mainUnitName,
    balance: item.amount,
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

  const table = new easyTable();

  if (data.length > 0) {
    data.forEach((item, index) => {
      table.cell("#", index + 1, easyTable.string());
      table.cell("Название", item.name, easyTable.string());
      table.cell("Ост.", `${item.balance}${item.unit}`, easyTable.string());
      table.newRow();
    });
  }

  await tbot.sendMessage(
    getTelegramChatId("balance"),
    `<pre>${table.toString()}</pre>`,
    { parse_mode: 'HTML' }
  );

  return res.json({ status: "OK", data });
});

module.exports = router;

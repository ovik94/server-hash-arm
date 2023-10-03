const router = require("express").Router();
const easyTable = require("easy-table");
const iikoWebApi = require("../iiko-web/api");
const gApi = require("../google-client/google-api");
const tbot = require("../telegram-bot/tbot");

const getTelegramChatId = require("../telegram-bot/get-telegram-chat-id");

router.get("/menu", async function (req, res, next) {
  const menu = await iikoWebApi.getMenu();
  const options = await gApi.getBanquetOptions();

  const transformedMenu = [];

  for (const group of menu) {
    transformedMenu.push({
      name: group.name,
      items: group.items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.itemSizes[0].price
      }))
    })
  }

  return res.json({ status: "OK", data: { options, menu: transformedMenu } });
});

router.get("/bar-balance", async function (req, res, next) {
  const { doNotSendInTelegram } = req.query;

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

  const data = [{ name: '--- Крепкий алкоголь ---', category: 'Крепкий алкоголь' }];

  const allowedAmounts = await gApi.getAllowedAmounts();

  for (const product of transformData) {
    const productMinBalance = allowedAmounts.find(storeProduct => storeProduct.name === product.name);

    if (productMinBalance && product.balance < productMinBalance.minBalance) {
      data.push(product);
    }
  }

  data.sort((a, b) => {
    if (a.category > b.category) {
      return -1;
    }

    if (a.category < b.category) {
      return 1;
    }

    return 0;
  });

  const table = new easyTable();

  if (data.length > 0) {
    data.forEach((item, index) => {
      if (item.balance !== undefined) {
        table.cell("Название", item.name, easyTable.string());
        table.cell("Ост.", `${item.balance}${item.unit}`, easyTable.string());
        table.newRow();
      } else {
        table.cell("Название", item.name, easyTable.string());
        table.cell("Ост.", '----', easyTable.string());
        table.newRow();
      }
    });
  }

  if (!doNotSendInTelegram) {
    await tbot.sendMessage(
      getTelegramChatId("balance"),
      `<pre>${table.toString()}</pre>`,
      { parse_mode: 'HTML' }
    );
  }

  return res.json({ status: "OK", data });
});

module.exports = router;

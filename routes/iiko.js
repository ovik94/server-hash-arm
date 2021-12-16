const router = require("express").Router();
const easyTable = require("easy-table");
const iikoWebApi = require("../iiko-web/api");
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");
const tbot = require("../telegram-bot/tbot");
const getTelegramChatId = require("../telegram-bot/get-telegram-chat-id");

router.get("/menu", async function (req, res, next) {
  const menu = await iikoWebApi.getMenu();

  const map = {
    potables: ['Напитки', 'Вино', 'Водка', 'Виски', 'Газировки', 'Лимонады', 'Пиво', 'Соки', 'Коньяк', 'Вода', 'Компоты', 'Ром', 'Шампанское'],
    salads: ['Салаты'],
    snacks: ['Холодные закуски', 'Жареные баклажаны', 'Пхали', 'Пивная закуска', 'Хачапури', 'Пиде', 'Ламаджо', 'Выпечка и горячие закуски'],
    hotter: ['Хоровац', 'Хоровац и Кебабы', 'Горячие блюда', 'Хинкали'],
    sideDishes: ['Гарниры', 'Картофель'],
    banquetMenu: ['Банкетное меню']
  }

  const result = {
    potables: [],
    salads: [],
    snacks: [],
    hotter: [],
    sideDishes: [],
    banquetMenu: []
  };

  menu.forEach(categoryData => {
    for (const key in map) {
      const categoryNames = map[key];

      if (categoryNames.includes(categoryData.name)) {
        const items = categoryData.items.map(item => ({ title: item.name, price: item.itemSizes[0].price, weight: item.itemSizes[0].portionWeightGrams }))
        result[key].push(...items);
        break;
      }
    }
  })


  return res.json({ status: "OK", data: result });
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

  const amountsValues = await gApi.getAllowedAmounts();
  const allowedAmounts = await transformRowsInArray(amountsValues);

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

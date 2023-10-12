const gApi = require("../src/google-client/google-api");
const iikoWebApi = require("../src/iiko-api/iikoWebApi");
const easyTable = require("easy-table");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");

async function getMenu (req, res) {
  const menu = await iikoWebApi.getMenu();
  const options = await gApi.getBanquetOptions();

  const transformedMenu = [];

  for (const group of menu) {
    transformedMenu.push({
      id: group.id,
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
}

async function getMenuItem (req, res) {
  const menuItem = await iikoWebApi.getMenuItem(req.query.id);

  return res.json({
    status: "OK",
    data: {
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.itemSizes[0].price,
      portionWeightGrams: menuItem.itemSizes[0].portionWeightGrams
    }
  });
}

async function getBarBalance (req, res) {
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
}

module.exports = { getMenu, getMenuItem, getBarBalance };

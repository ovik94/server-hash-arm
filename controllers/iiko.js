const gApi = require("../src/google-client/google-api");
const iikoWebApi = require("../src/iiko-api/iikoWebApi");
const easyTable = require("easy-table");
const tbot = require("../src/telegram-bot/tbot");
const getTelegramChatId = require("../src/telegram-bot/get-telegram-chat-id");
const BarLimitsModel = require("../model/barLimits");

async function getMenu(req, res) {
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

async function getMenuItem(req, res) {
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

async function saveBarLimits(req, res) {
  try {
    await BarLimitsModel.deleteMany();
    await BarLimitsModel.create(req.body.limits);
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const limits = await BarLimitsModel.find();

  return res.json({ status: "OK", data: limits });
}

async function getBarNomenclature(req, res) {
  const barNomenclature = [];

  try {
    const productsBalance = await iikoWebApi.getBarBalance();

    const filteredProduct = productsBalance.filter(
      (product) => product.product.categoryName === "Напитки" || product.product.categoryName === "Крепкий Алкоголь"
    );

    for (let product of filteredProduct) {
      const productLimit = await BarLimitsModel.findOne({ id: product.product.id });

      barNomenclature.push({
        id: product.product.id,
        name: product.product.name,
        category: product.product.categoryName,
        limit: productLimit?.limit || undefined
      })
    }
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }


  return res.json({ status: "OK", data: barNomenclature });
}

async function getBarBalance(req, res) {
  const { doNotSendInTelegram } = req.query;

  const productsBalance = await iikoWebApi.getBarBalance();

  const filteredProduct = productsBalance.filter(
    (product) => product.product.categoryName === "Напитки" || product.product.categoryName === "Крепкий Алкоголь"
  );

  const transformData = filteredProduct.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    category: item.product.categoryName,
    balance: item.amount,
  }));

  const data = [];

  const limits = await BarLimitsModel.find();

  for (const product of transformData) {
    const productLimit = limits.find(limit => limit.id === product.id);

    if (productLimit?.limit && product.balance < productLimit.limit) {
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


  if (!doNotSendInTelegram) {
    const table = new easyTable();

    if (data.length > 0) {
      data.forEach((item, index) => {
        if (item.balance !== undefined) {
          table.cell("Название", item.name, easyTable.string());
          table.cell("Ост.", `${item.balance} л.`, easyTable.string());
          table.newRow();
        } else {
          table.cell("Название", item.name, easyTable.string());
          table.cell("Ост.", '----', easyTable.string());
          table.newRow();
        }
      });
    }

    await tbot.sendMessage(
      getTelegramChatId("balance"),
      `<pre>${table.toString()}</pre>`,
      { parse_mode: 'HTML' }
    );
  }

  return res.json({ status: "OK", data });
}

module.exports = { getMenu, getMenuItem, getBarBalance, getBarNomenclature, saveBarLimits };

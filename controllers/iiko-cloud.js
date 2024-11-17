const iikoCloudApi = require("../src/iiko-api/iikoCloudApi");
const { format } = require("date-fns");

async function getReserveList(req, res) {
  try {
    const reserves = await iikoCloudApi.getReserveListIds(req.query.date);

    return res.json({ status: "OK", data: reserves });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}

async function getCurrentPrepays(req, res) {
  try {
    const currentFormattedDate = `${format(
      new Date(),
      "yyyy-MM-dd"
    )} 00:00:00.123`;
    const reserveIds =
      (await iikoCloudApi.getReserveListIds(currentFormattedDate)) || [];
    const prepays = await iikoCloudApi.getCurrentPrepays(reserveIds);

    return res.json({ status: "OK", data: prepays });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}

async function getMenuList(req, res) {
  try {
    const menuList = await iikoCloudApi.getMenuList();

    return res.json({ status: "OK", data: menuList });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}

async function getMenu(req, res) {
  try {
    const menu = await iikoCloudApi.getMenuById(req.body.id);

    const transformedMenu = menu.itemCategories.map((itemCategory) => ({
      id: itemCategory.id,
      name: itemCategory.name,
      items: itemCategory.items.map((menuItem) => {
        const itemSize = menuItem.itemSizes.find((item) => item.isDefault);

        return {
          name: menuItem.name,
          description: menuItem.description,
          size: {
            weight: itemSize?.portionWeightGrams,
            sizeName: itemSize?.sizeName || "гр.",
          },
          price: itemSize?.prices[0]?.price,
          image: itemSize?.buttonImageUrl,
        };
      }),
    }));

    return res.json({ status: "OK", data: transformedMenu });
  } catch (err) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}

module.exports = { getReserveList, getCurrentPrepays, getMenuList, getMenu };

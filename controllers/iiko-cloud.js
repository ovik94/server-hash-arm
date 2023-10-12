const iikoCloudApi = require("../src/iiko-api/iikoCloudApi");
const { format } = require("date-fns");

async function getReserveList (req, res) {
  try {
    const reserves = await iikoCloudApi.getReserveListIds(req.query.date);

    return res.json({ status: "OK", data: reserves  });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.data || err.message });
  }
}

async function getCurrentPrepays(req, res) {
  try {
    const currentFormattedDate = `${format(new Date(), 'yyyy-MM-dd')} 00:00:00.123`;
    const reserveIds = await iikoCloudApi.getReserveListIds(currentFormattedDate) || [];
    const prepays = await iikoCloudApi.getCurrentPrepays(reserveIds);

    return res.json({ status: "OK", data: prepays  });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.data || err.message });
  }
}

module.exports = { getReserveList, getCurrentPrepays };

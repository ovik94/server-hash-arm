const iikoServerApi = require("../src/iiko-api/iikoServerApi");

async function getLunchSales (req, res) {
  try {
    const result = await iikoServerApi.getLunchSales(req.body.dateFrom, req.body.dateTo);

    return res.json({ status: "OK", data: result  });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.data || err.message });
  }
}
module.exports = { getLunchSales };

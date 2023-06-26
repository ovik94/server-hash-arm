const router = require("express").Router();
const iikoServerApi = require("../iiko-server/api");

router.post("/get-lunch-sales", async function (req, res, next) {
  try {
    const result = await iikoServerApi.getLunchSales(req.body.dateFrom, req.body.dateTo);

    return res.json({ status: "OK", data: result  });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.data || err.message });
  }
});


module.exports = router;

const router = require("express").Router();
const iikoCloudApi = require("../iiko-cloud/api");

router.get("/deliveries", async function (req, res, next) {
  try {
    const deliveries = await iikoCloudApi.getDeliveries(req.body.date);

    return res.json({ status: "OK", data: deliveries  });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.data || err.message });
  }
});


module.exports = router;

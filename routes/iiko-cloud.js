const router = require("express").Router();
const iikoCloudApi = require("../iiko-cloud/api");
const { format } = require("date-fns");

router.get("/reserve-list", async function (req, res, next) {
  try {
    const reserves = await iikoCloudApi.getReserveList(req.query.date);

    return res.json({ status: "OK", data: reserves  });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.data || err.message });
  }
});

router.get("/current-prepays", async function (req, res, next) {
  try {
    const currentFormattedDate = `${format(new Date(), 'yyyy-MM-dd')} 00:00:00.123`;
    const reserveIds = await iikoCloudApi.getReserveListIds(currentFormattedDate) || [];
    const prepays = await iikoCloudApi.getCurrentPrepays(reserveIds);

    return res.json({ status: "OK", data: prepays  });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.data || err.message });
  }
});


module.exports = router;

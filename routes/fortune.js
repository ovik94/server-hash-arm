const router = require("express").Router();
const gApi = require("../google-client/google-api");

router.get("/list", async function (req, res, next) {
  const fortuneList = await gApi.getFortune(req.query.type);

  return res.json({ status: "OK", data: fortuneList.map(item => ({ ...item, count: Number(item.count) })) });
});

module.exports = router;

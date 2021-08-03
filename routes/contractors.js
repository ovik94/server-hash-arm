const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");

router.get("/", async function (req, res, next) {
  const userData = await gApi.getContractorsData();
  const data = await transformRowsInArray(userData);

  return res.json({ status: "OK", data });
});

router.get("/packaging", async function (req, res, next) {
  const userData = await gApi.getPackagingData();
  const data = await transformRowsInArray(userData);

  return res.json({ status: "OK", data });
});

module.exports = router;
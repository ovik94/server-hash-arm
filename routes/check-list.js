const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformColumnsInArray = require("../google-client/utils/transform-columns-in-Array");

router.get("/", async function (req, res, next) {
  const userData = await gApi.getCheckListData();
  const data = await transformColumnsInArray(userData);

  return res.json({ status: "OK", data });
});

module.exports = router;
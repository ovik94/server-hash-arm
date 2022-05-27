const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformColumnsInArray = require("../google-client/utils/transform-columns-in-array");

router.get("/", async function (req, res, next) {
  const data = await gApi.getCheckListData();

  return res.json({ status: "OK", data });
});

module.exports = router;
const router = require("express").Router();
const gApi = require("../google-client/google-api");
const formatter = require("../google-client/utils/formatter-table-data");

router.get("/list", async function (req, res, next) {
  const userData = await gApi.getUserData();
  const data = await formatter(userData);

  return res.json({ status: "OK", data });
});

module.exports = router;

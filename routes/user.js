const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");

router.get("/list", async function (req, res, next) {
  const userData = await gApi.getUserData();

  return res.json({ status: "OK", data: userData });
});

module.exports = router;

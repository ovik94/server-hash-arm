const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");

router.get("/", async function (req, res, next) {
  const data = await gApi.getInstructionsData();

  return res.json({ status: "OK", data });
});

module.exports = router;
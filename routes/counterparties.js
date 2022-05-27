const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");

router.get("/", async function (req, res, next) {
  let data = await gApi.getCounterparties();
  const { role } = req.query;

  if (role) {
    data = data.filter(item => item.role === role);
  }

  const result = {};
  data.forEach((item) => {
    if (result[item.role]) {
      result[item.role].push(item);
    } else {
      result[item.role] = [item];
    }
  })

  return res.json({ status: "OK", data: result });
});

module.exports = router;

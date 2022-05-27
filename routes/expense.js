const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");

router.get("/", async function (req, res, next) {
  const reports = await gApi.getExpenses();

  const result = reports.map(item => ({ ...item, category: item.category ? JSON.parse(item.category) : {} }));

  return res.json({ status: "OK", data: result });
});

router.post("/add", async function (req, res, next) {
  const { body } = req;

  const newExpense = await gApi.addExpense(body);

  return res.json({ status: newExpense ? 'OK' : 'ERROR' });
});

router.post("/delete", async function (req, res, next) {
  const { body } = req;
  let resultStatus = 'OK';

  const result = await gApi.deleteExpense(body.id);

  if (!result) {
    resultStatus = 'ERROR'
  }

  return res.json({ status: resultStatus  });
});

module.exports = router;
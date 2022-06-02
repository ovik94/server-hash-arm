const router = require("express").Router();
const gApi = require("../google-client/google-api");
const transformRowsInArray = require("../google-client/utils/transform-rows-in-array");

router.get("/", async function (req, res, next) {
  try {
    const reports = await gApi.getExpenses();
    const result = reports.map(item => ({ ...item, category: item.category ? JSON.parse(item.category) : {} }));
    return res.json({ status: "OK", data: result });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
});

router.post("/add", async function (req, res, next) {
  const { body } = req;

  try {
    await gApi.addExpense(body);
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK' });
});

router.post("/delete", async function (req, res, next) {
  const { body } = req;

  if (!body.id) {
    return res.json({ status: 'ERROR', message: 'Не указан id расхода' });
  }

  try {
    await gApi.deleteExpense(body.id);
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK' });
});

module.exports = router;
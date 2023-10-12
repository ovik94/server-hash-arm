const gApi = require("../src/google-client/google-api");

async function getExpenses (req, res) {
  try {
    const reports = await gApi.getExpenses();
    const result = reports.map(item => ({ ...item, category: item.category ? JSON.parse(item.category) : {} }));
    return res.json({ status: "OK", data: result });
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }
}

async function addExpense (req, res) {
  const { body } = req;

  try {
    await gApi.addExpense(body);
  } catch (err) {
    return res.json({ status: 'ERROR', message: err.message });
  }

  return res.json({ status: 'OK' });
}

async function deleteExpense (req, res) {
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
}

module.exports = { getExpenses, addExpense, deleteExpense };

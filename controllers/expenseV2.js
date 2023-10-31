const TempExpensesModel = require("../model/tempExpenses");

async function getExpenses (req, res) {
  let expenses;

  try {
    expenses = await TempExpensesModel.find();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: expenses });
}

async function addExpense (req, res) {
  const newExpense = new TempExpensesModel(req.body);

  try {
    await newExpense.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const expenses = await TempExpensesModel.find();

  return res.json({ status: "OK", data: expenses });
}

async function deleteExpense (req, res) {
  if (!req.body.id) {
    return res.json({ status: 'ERROR', message: 'Не указан id расхода' });
  }

  try {
    await TempExpensesModel.deleteOne({ _id: req.body.id });
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const expenses = await TempExpensesModel.find();

  return res.json({ status: "OK", data: expenses });
}

module.exports = { getExpenses, addExpense, deleteExpense };

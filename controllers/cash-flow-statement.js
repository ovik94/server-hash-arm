const CashFlowStatementModel = require("../model/сashFlowStatement");

const transformed = (data) => data.map(field => {
  return {
    name: field.name,
    type: field.type,
    paymentTypes: field.paymentTypes,
    purposeOfPayment: field.purposeOfPayment,
    id: field._id
  }
});

async function getCashFlowStatement(req, res,) {
  let counterparties;

  try {
    counterparties = await CashFlowStatementModel.find(req.query.type ? { type: req.query.type } : {}).sort({ type: 1 }).exec();
  } catch (err) {
    console.log(err, 'err');
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: transformed(counterparties) });
}

async function addCashFlowStatement(req, res) {
  const newCashFlowStatement = new CashFlowStatementModel(req.body);

  try {
    await newCashFlowStatement.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const cashFlowStatement = await CashFlowStatementModel.find().sort({ type: 1 }).exec();

  return res.json({ status: "OK", data: transformed(cashFlowStatement) });
}

async function editCashFlowStatement(req, res) {
  const cashFlowStatement = await CashFlowStatementModel.findById(req.body.id);

  cashFlowStatement.name = req.body.name;
  cashFlowStatement.type = req.body.type;
  cashFlowStatement.paymentTypes = req.body.paymentTypes;
  cashFlowStatement.purposeOfPayment = req.body.purposeOfPayment;

  try {
    await cashFlowStatement.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const allCashFlowStatement = await CashFlowStatementModel.find().sort({ type: 1 }).exec();

  return res.json({ status: "OK", data: transformed(allCashFlowStatement) });
}

async function deleteCashFlowStatement(req, res) {
  try {
    await CashFlowStatementModel.deleteOne({ _id: req.body.id });
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const allCashFlowStatement = await CashFlowStatementModel.find().sort({ type: 1 }).exec();

  return res.json({ status: "OK", data: transformed(allCashFlowStatement) });
}


module.exports = { getCashFlowStatement, addCashFlowStatement, deleteCashFlowStatement, editCashFlowStatement };

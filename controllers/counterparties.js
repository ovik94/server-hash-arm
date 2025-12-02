const CounterpartiesModel = require("../model/counterparties");

const transformedCounterparties = (data) => data.map(field => {
  return {
    name: field.name,
    type: field.type,
    companyName: field.companyName,
    phone: field.phone,
    description: field.description,
    id: field._id
  }
});

async function getCounterparties(req, res,) {
  let counterparties;

  try {
    counterparties = await CounterpartiesModel.find(req.query.type ? { type: req.query.type } : {}).sort({ type: 1 }).exec();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: transformedCounterparties(counterparties) });
}

async function addCounterparty(req, res) {
  const newCounterparties = new CounterpartiesModel(req.body);

  try {
    await newCounterparties.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const counterparties = await CounterpartiesModel.find().sort({ type: 1 }).exec();

  return res.json({ status: "OK", data: transformedCounterparties(counterparties) });
}

async function editCounterparty(req, res) {
  const counterparty = await CounterpartiesModel.findById(req.body.id);

  counterparty.name = req.body.name;
  counterparty.type = req.body.type;
  counterparty.companyName = req.body.companyName;
  counterparty.phone = req.body.phone;
  counterparty.description = req.body.description;

  try {
    await counterparty.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const counterparties = await CounterpartiesModel.find().sort({ type: 1 }).exec();

  return res.json({ status: "OK", data: transformedCounterparties(counterparties) });
}

async function deleteCounterparty(req, res) {
  try {
    await CounterpartiesModel.deleteOne({ _id: req.body.id });
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const counterparties = await CounterpartiesModel.find().sort({ type: 1 }).exec();

  return res.json({ status: "OK", data: transformedCounterparties(counterparties) });
}


module.exports = { getCounterparties, addCounterparty, deleteCounterparty, editCounterparty };

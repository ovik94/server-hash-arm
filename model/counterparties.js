const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterpartiesSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['kitchen', 'service', 'manager', 'provider'] },
  companyName: String,
  phone: String,
  description: String,
}, { versionKey: false });

module.exports = mongoose.model('Counterparties', counterpartiesSchema);

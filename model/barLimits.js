const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const barLimitsSchema = new Schema({
  id: { type: String, required: true },
  limit: { type: Number, required: false }
}, { versionKey: false });

module.exports = mongoose.model('BarLimits', barLimitsSchema);

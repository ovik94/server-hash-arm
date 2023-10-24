const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wheelOfFortuneContentSchema = new Schema({
  title: { type: String, required: true },
  color: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('WheelOfFortuneContent', wheelOfFortuneContentSchema);

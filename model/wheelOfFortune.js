const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wheelOfFortuneSchema = new Schema({
  code: { type: String, required: true },
  description: { type: String, required: true },
  content: [{ type: Schema.Types.ObjectId, ref: 'WheelOfFortuneContent'}]
}, { versionKey: false });

module.exports = mongoose.model('WheelOfFortune', wheelOfFortuneSchema);

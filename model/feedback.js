const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  title: { type: String, required: true },
  subtitle: String,
  type: { type: String, required: true, enum: ['textInput', 'textArea', 'select', 'rating', 'selectOtherVariant', 'selectGroupString', 'selectGroupNumber'] },
  options: [String],
  required: Boolean,
}, { versionKey: false });

module.exports = mongoose.model('Feedback', feedbackSchema);

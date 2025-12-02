const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cashFlowStatementSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['receipts', 'expenses', 'info'] },
  paymentTypes: {
    type: [String],
    default: undefined
  },
  purposeOfPayment: {
    type: [String],
    default: undefined
  },
}, { versionKey: false });

module.exports = mongoose.model('CashFlowStatement', cashFlowStatementSchema);

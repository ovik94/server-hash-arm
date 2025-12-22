const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dailyReportSchema = new Schema(
  {
    date: { type: String, required: true },
    adminName: { type: String, required: true },
    ipCash: { type: String, required: true },
    ipAcquiring: { type: String, required: true },
    oooCash: { type: String, required: true },
    oooAcquiring: { type: String, required: true },
    yandex: String,
    ipNetmonet: String,
    oooNetmonet: String,
    ipOnline: String,
    oooOnline: String,
    totalSum: { type: String, required: true },
    totalCash: { type: String, required: true },
    expenses: [
      {
        id: { type: String, required: true },
        sum: { type: String, required: true },
        cashFlowStatement: { type: String, required: true },
        comment: String,
        counterparty: String,
      },
    ],
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

module.exports = mongoose.model("DailyReport", dailyReportSchema);

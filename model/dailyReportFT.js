const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dailyReportSchema = new Schema(
  {
    date: { type: String, required: true },
    adminName: { type: String, required: true },
    cash: { type: String, required: true },
    acquiring: { type: String, required: true },
    yandex: { type: String, required: false },
    totalSum: { type: String, required: true },
    comment: { type: String, required: false },
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

module.exports = mongoose.model("DailyReportFT", dailyReportSchema);

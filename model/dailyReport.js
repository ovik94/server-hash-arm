const mongoose = require('mongoose');
const { format } = require("date-fns");
const Schema = mongoose.Schema;

const dailyReportSchema = new Schema({
  date: { type: Date, required: true },
  adminName: { type: String, required: true },
  ipCash: { type: String, required: true },
  ipAcquiring: { type: String, required: true },
  oooCash: { type: String, required: true },
  oooAcquiring: { type: String, required: true },
  yandex: String,
  totalSum: { type: String, required: true },
  totalCash: { type: String, required: true },
  expenses: [{
    id: { type: String, required: true },
    sum: { type: String, required: true },
    comment: String,
    counterparty: String,
    category: {
      title: { type: String, required: true },
      icon: { type: String, required: true },
      counterpartyType: String
    }
  }]
}, {
  versionKey: false,
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id
      ret.date = format(ret.date, 'dd.MM.yyyy')
      delete ret._id
    }
  }
});

module.exports = mongoose.model('DailyReport', dailyReportSchema);

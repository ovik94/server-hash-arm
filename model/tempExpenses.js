const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempExpensesSchema = new Schema({
  sum: { type: String, required: true },
  comment: String,
  counterparty: String,
  category: [{
    title: { type: String, required: true },
    icon: { type: String, required: true },
    counterpartyType: String
  }]
}, {
  versionKey: false,
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id

      ret.category = ret.category.map(item => {
        const resultCategory = { ...item };

        delete resultCategory._id;
        return resultCategory;
      });

      delete ret._id
    }
  }
});

module.exports = mongoose.model('TempExpenses', tempExpensesSchema);

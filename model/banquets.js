const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banquetsSchema = new Schema({
  admin: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  personsCount: { type: Number, required: true },
  date: { type: Date, required: true },
  menu: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    items: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: false },
      price: { type: Number, required: true },
      count: { type: Number, required: true },
      weight: { type: Number, required: true },
    }],
  }],
  sum: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  sale: { type: String, required: false },
  serviceFee: { type: Boolean, required: false },
  comment: { type: String, required: false }
}, {
  versionKey: false,
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id
      delete ret._id
    }
  }
});

module.exports = mongoose.model('Banquets', banquetsSchema);

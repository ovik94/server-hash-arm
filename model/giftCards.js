const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const giftCardsSchema = new Schema(
  {
    value: { type: Number, required: true },
    number: { type: Number, required: true },
    code: { type: Number, required: true },
    activationDate: String,
    status: {
      type: String,
      required: true,
      enum: ["NOT_ACTIVATED", "ACTIVATED"],
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("GiftCards", giftCardsSchema);

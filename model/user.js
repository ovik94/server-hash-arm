const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "waiter", "supervisor", "teller"],
    },
    phone: { type: String, required: false },
    password: { type: String, required: false },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Users", usersSchema);

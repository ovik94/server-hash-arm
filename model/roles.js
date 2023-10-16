const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
  name: { type: String, required: true },
  privilege: { type: [String], required: true }
}, { versionKey: false });

module.exports = mongoose.model('Roles', rolesSchema);

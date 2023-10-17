const mongoose = require("mongoose")


const counterSchema = new mongoose.Schema({
  name: String,
  seq: { type: Number, default: 0 }
});
var Counter = mongoose.model('counter', counterSchema);

module.exports = { Counter }
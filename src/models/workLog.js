const mongoose = require("mongoose")
const { Counter } = require("./counters")

const workLogSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  time: {
    type: Number
  },
  description: {
    type: String
  },
  updateDate: {
    type: Date,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
})

workLogSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'WorkLog' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    doc.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });
});

var WorkLog = mongoose.model("WorkLog", workLogSchema)

module.exports = { WorkLog }

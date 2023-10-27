const mongoose = require("mongoose")
const { Counter } = require("./counters")

const employeeLeaveTypeSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  leaveType:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveType"
  }
  ,
  total: {
    type: Number,
  },
  remain: {
    type: Number,
    default: 0,
  },
  taken: {
    type: Number,
    default: 0,
  },
  forward: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number
  },
  updateDate: {
    type: Date,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
})

const leaveTypeSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  default: {
    type: Number,
  },
  status: {
    type: Number
  },
  updateDate: {
    type: Date,
  }
})

leaveTypeSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'LeaveType' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    doc.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });

});

var LeaveType = mongoose.model("LeaveType", leaveTypeSchema)
var EmployeeLeaveType = mongoose.model("EmployeeLeaveType", employeeLeaveTypeSchema)

module.exports = { EmployeeLeaveType, LeaveType }

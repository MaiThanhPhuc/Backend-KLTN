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

const leaveRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
  code: {
    type: Number,
  },
  leaveType:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveType"
  },
  reason: {
    type: String,
  },
  date: {
    type: Date,
  },
  timeType: {
    type: Number,
  },
  timeValue: {
    type: Number,
  },
  approvalStatus: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
      },
      description: {
        type: String,
      },
      status: {
        type: Number
      },
      updateDate: {
        type: Date,
      }
    }
  ],
  updateDate: {
    type: Date,
  },
  status: {
    type: Number,
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

leaveRequestSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'LeaveRequest' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
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
var LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema)

module.exports = { EmployeeLeaveType, LeaveType, LeaveRequest }

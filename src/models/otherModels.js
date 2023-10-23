const mongoose = require("mongoose")
const { Counter } = require("./counters")

const officeSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  createdDay: {
    type: Date,
  },
  phone: {
    type: String
  },
  status: {
    type: Number
  },

})

const departmentSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  name: {
    type: String,
  },
  shortName: {
    type: String,
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office"
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
  createdDay: {
    type: Date,
  },
  status: {
    type: Number
  }
})

const teamSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  name: {
    type: String,
  },
  shortName: {
    type: String,
  },
  createdDay: {
    type: Date,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  status: {
    type: Number
  }
})

const jobLeaveSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  leaveType: {
    type: Number,
  },
  total: {
    type: Number,
  },
  remain: {
    type: Number,
  },
  taken: {
    type: Number,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
  status: {
    type: Number
  }
})

officeSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'Office' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    doc.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });

});

departmentSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'Department' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    doc.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });

});

teamSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'Team' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    doc.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });

});

jobLeaveSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'JobLeave' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    doc.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });

});

// const Contract = mongoose.model("Contract", contractSchema)
var Department = mongoose.model("Department", departmentSchema)
var JobLeave = mongoose.model("JobLeave", jobLeaveSchema)
var Office = mongoose.model("Office", officeSchema)
var Team = mongoose.model("Team", teamSchema)

module.exports = { Department, JobLeave, Office, Team }
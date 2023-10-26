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
  updateDate: {
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
  updateDate: {
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
  updateDate: {
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

var Department = mongoose.model("Department", departmentSchema)
var Office = mongoose.model("Office", officeSchema)
var Team = mongoose.model("Team", teamSchema)

module.exports = { Department, Office, Team }
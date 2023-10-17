const mongoose = require("mongoose")
const { isEmail } = require('validator');
const { Counter } = require("./counters");

const employeeSchema = new mongoose.Schema({
  code: {
    type: Number
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  birthday: {
    type: Date,
    require: true
  },
  email: {
    type: String,
    require: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    require: [true, "Please enter a password"],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  password: {
    type: String,
    require: true
  },
  gender: {
    type: String,
  },
  phone: {
    type: Number,
  },
  citizenId: {
    type: Number,
  },
  status: {
    type: Number,
  },
  role: {
    type: Number,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  jobLeave: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobLeave"
  }
})


employeeSchema.pre('save', function (next) {
  var doc = this;
  Counter.findOneAndUpdate({ name: 'Employee' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    doc.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });

});

var Employee = mongoose.model("Employee", employeeSchema)


module.exports = { Employee }
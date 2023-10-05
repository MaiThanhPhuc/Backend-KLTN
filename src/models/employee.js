const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({
  code: {
    type: String,
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
    require: true
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

let Employee = mongoose.model("Employee", employeeSchema)

module.exports = { Employee }
const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({
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
  gender: {
    type: String,
  },
  phone: {
    type: Number,
  },
  taxCode: {
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
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract"
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  jobLeave: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobLeave"
  },
  healthyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Healthy"
  },
})

let Employee = mongoose.model("Employee", employeeSchema)

module.exports = { Employee }
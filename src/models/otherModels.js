const mongoose = require("mongoose")

const contractSchema = new mongoose.Schema({
  createdDay: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  linkPdf: {
    type: String,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
})

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },

})

const jobLeaveSchema = new mongoose.Schema({
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
})

let Contract = mongoose.model("Contract", contractSchema)
let Department = mongoose.model("Department", departmentSchema)
let JobLeave = mongoose.model("JobLeave", jobLeaveSchema)

module.exports = { Contract, Department, JobLeave }
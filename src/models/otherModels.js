const mongoose = require("mongoose")

const officeSchema = new mongoose.Schema({
  code: {
    type: String,
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
    type: Number
  }
})

const departmentSchema = new mongoose.Schema({
  code: {
    type: String,
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
  createdDay: {
    type: Date,
  },
})

const teamSchema = new mongoose.Schema({
  code: {
    type: String,
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
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
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

// const Contract = mongoose.model("Contract", contractSchema)
const Department = mongoose.model("Department", departmentSchema)
const JobLeave = mongoose.model("JobLeave", jobLeaveSchema)
const Office = mongoose.model("Office", officeSchema)
const Team = mongoose.model("Team", teamSchema)

module.exports = { Department, JobLeave, Office, Team }
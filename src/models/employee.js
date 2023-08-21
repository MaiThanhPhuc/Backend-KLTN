const mongoose = require("mongoose")
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

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

employeeSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

let Employee = mongoose.model("Employee", employeeSchema)

module.exports = { Employee }
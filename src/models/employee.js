const mongoose = require("mongoose")
const { isEmail } = require('validator');
const { Counter } = require("./counters");
const { generatePassword } = require("../utils/common");

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
  fullName: {
    type: String,
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
    require: true
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
  },
  startedDate: {
    type: Date,
  },
  address: {
    type: String,
  },
  bankName: {
    type: String,
  },
  bankNo: {
    type: String,
  },
  status: {
    type: Number,
  },
  role: {
    type: Number,
  },
  age: {
    type: Number,
  },
  salary: {
    type: Number,
    default: 0
  },
  updateDate: {
    type: Date,
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
  leaveType: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeeLeaveType"
  }],
  employeeSalary: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeeSalary"
  }]
})

const employeeSalarySchema = new mongoose.Schema({
  contractSalary: {
    type: Number,
    default: 0
  },
  paidSalary: {
    type: Number,
    default: 0
  },
  paidDay: {
    type: Number,
    default: 0
  },
  taxIncomeRate: {
    type: Number,
    default: 0
  },
  taxValue: {
    type: Number,
    default: 0
  },
  transportAllowance: {
    type: Number,
    default: 0
  },
  mealAllowance: {
    type: Number,
    default: 0
  },
  workingDay: {
    type: Number,
    default: 0
  },
  otDay: {
    type: Number,
    default: 0
  },
  workingDayOfMonth: {
    type: Number,
    default: 0
  },
  month: {
    type: Number
  },
  year: {
    type: Number
  },
  updateDate: {
    type: Date
  },
  status: {
    type: Number
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
})

employeeSchema.pre('save', async function (next) {
  var emp = this;
  emp.password = await generatePassword(emp.password)
  emp.fullName = `${emp.firstName} ${emp.lastName}`
  Counter.findOneAndUpdate({ name: 'Employee' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
    console.log("...count: " + JSON.stringify(count));
    emp.code = count.seq;
    next();
  })
    .catch(function (error) {
      console.error("counter error-> : " + error);
      throw error;
    });

});

employeeSchema.pre('insertMany', async function (next, docs) {
  for (const emp of docs) {
    emp.password = await generatePassword(emp.password)
    emp.status = Status.ACTIVE
    emp.role = EmployeeRole.MEMBER
    emp.fullName = `${emp.firstName} ${emp.lastName}`
    await Counter.findOneAndUpdate({ name: 'Employee' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
      console.log("...count: " + JSON.stringify(count));
      emp.code = count.seq;
    })
      .catch(function (error) {
        console.error("counter error-> : " + error);
        throw error;
      });
  }
  next();
});

const Status = {
  ACTIVE: 1,
  DEACTIVE: 0
}

const EmployeeRole = {
  ADMIN: 0,
  HUMAN_RESOURCE: 1,
  MANAGER: 2,
  LEADER: 3,
  MEMBER: 4,
}


var Employee = mongoose.model("Employee", employeeSchema)
var EmployeeSalary = mongoose.model("EmployeeSalary", employeeSalarySchema)

module.exports = { Employee, EmployeeSalary }
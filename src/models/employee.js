const mongoose = require("mongoose")
const { isEmail } = require('validator');
const { Counter } = require("./counters");
const generator = require('generate-password');

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
  updateDate: {
    type: Date,
  },
  isAdmin: {
    type: Boolean,
    default: false
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
  }]
})


employeeSchema.pre('save', function (next) {
  var emp = this;
  emp.password = generatePassword(emp.password)
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
  if (Array.isArray(docs) && docs.length) {
    const markEmployee = docs.map(async (emp) => {
      await Counter.findOneAndUpdate({ name: 'Employee' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
        emp.code = count.seq;
        emp.password = generatePassword(emp.password)
        emp.fullName = `${emp.firstName} ${emp.lastName}`
        emp.status = Status.ACTIVE
        console.log("...count: " + emp.code);
      })
    })
  }
  next();
});

const generatePassword = (password) => {
  password = generator.generate({
    length: 10,
    uppercase: true,
    lowercase: true,
    numbers: true,
  });
  return password
}
const Status = {
  ACTIVE: 0,
  DEACTIVE: 1
}


var Employee = mongoose.model("Employee", employeeSchema)


module.exports = { Employee }
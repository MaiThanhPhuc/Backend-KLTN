/* eslint-disable no-unused-vars */
const { Employee, EmployeeSalary } = require("../models/employee")
const { EmployeeLeaveType, LeaveRequest } = require("../models/leaveType");
const { Team, Department } = require("../models/companyModels");
const { WorkLog } = require("../models/workLog");
const Constants = require("../models/contants");
const { generatePassword } = require("../utils/common");
const { sendPayslipSalary } = require("./emailServices");
var mongoose = require('mongoose');

const employeeServices = {
  addEmployee: async (req, res) => {

    const newEmployee = new Employee(req.body);
    let uniqueEmail = await Employee.findOne({ email: newEmployee.email });
    if (uniqueEmail) return res.status(400).send("User already registered.");
    const savedEmployee = await newEmployee.save()
    if (savedEmployee) {
      if (savedEmployee.role == Constants.EmployeeRole.LEADER) {
        await Team.findByIdAndUpdate(savedEmployee.team, { leader: savedEmployee._id })
      }
      if (savedEmployee.role == Constants.EmployeeRole.MANAGER) {
        await Department.findByIdAndUpdate(savedEmployee.department, { manager: savedEmployee._id })
      }
    }
    return (savedEmployee)

  },

  saveImportEmployee: async (req, res) => {

    const savedEmployee = await Employee.insertMany(req.body);
    return (savedEmployee)

  },
  getAllEmployee: async (req, res) => {

    const employees = await Employee.find();
    return (employees)

  },

  getEmployeeById: async (req, res) => {

    const employee = await Employee.findById(req.params.id).populate("team").populate("department").populate("office");
    const empLeaveType = await EmployeeLeaveType.find({ employee: req.params.id }).populate("leaveType");
    const reponse = { employeeInfo: employee, leaveType: empLeaveType }
    return (reponse)
  },

  getEmployeeSalary: async (req, res) => {
    const employeeId = new mongoose.Types.ObjectId(req.query.employeeId);
    const employee = await Employee.findById(employeeId).populate("team").populate("department").populate("office");
    const employeeSalary = await EmployeeSalary.findOne({ employee: employeeId, month: parseInt(req.query.month), year: parseInt(req.query.year) });
    const reponse = { employeeInfo: employee, empSalary: employeeSalary }
    return (reponse)
  },

  updateEmployeeById: async (req, res) => {
    const emp = new Employee(req)
    emp.fullName = `${emp.firstName} ${emp.lastName}`
    await Employee.findByIdAndUpdate(req.params.id, { $set: emp })
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      if (employee.role == Constants.EmployeeRole.LEADER) {
        await Team.findByIdAndUpdate(employee.team, { leader: employee._id })
      }
      if (employee.role == Constants.EmployeeRole.MANAGER) {
        await Department.findByIdAndUpdate(employee.department, { manager: employee._id })
      }
    }
    return (true)

  },

  deleteEmployeeById: async (req, res) => {

    const employee = await Employee.findByIdAndDelete(req.params.id);

    await employee.updateOne({ $set: req.body })
    return
  },

  searchEmployee: async (req, res) => {

    const {
      limit = 5,
      orderBy = 'code',
      sortBy = 'asc',
      keyword
    } = req.query
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const role = req.query?.role;
    const status = parseInt(req.query.status) == 0 ? Constants.Status.DEACTIVE : Constants.Status.ACTIVE;
    // const officeId = req.query.officeId || "";
    // const departmentId = req.query.departmentId || "";
    // const teamId = req.query.teamId || "";

    const skip = (pageIndex - 1) * limit;

    const queries = {
      status: status,
      isAdmin: false || undefined
    }

    if (keyword) queries.fullName = { $regex: keyword, $options: 'i' }
    if (role) {
      const temp = role.length > 1 ? role.map(item => parseInt(item)) : [parseInt(role)]
      queries.role = { $in: temp }
    }
    const result = await Employee.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy })
      .populate("team").populate("department").populate("office");
    const totalItems = await Employee.countDocuments(queries)


    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })
  },
  getAbsentByDate: async (req, res) => {

    const {
      limit = 5,
      orderBy = 'updateDate',
      sortBy = 'asc',
      currentDate,
      dateFrom,
      dateTo
    } = req.query
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const skip = (pageIndex - 1) * limit;

    var start = new Date();
    var end = new Date(start);

    if (currentDate) {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }
    if (dateFrom) {
      var start1 = new Date(dateFrom);
      start.setDate(start1.getUTCDate());
      start = new Date(start1.setHours(0, 0, 0, 0)).toISOString()
    }
    if (dateTo) {
      var end1 = new Date(dateTo);
      end.setDate(end1.getUTCDate());
      end = new Date(end1.setHours(23, 59, 59, 999)).toISOString()
    }

    const queries = {
      date: {
        $gte: start,
        $lte: end,
      }
    }

    const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy })
      .populate(
        {
          path: 'employee',
          populate: [
            {
              path: 'department',
              model: 'Department'
            },
            {
              path: 'team',
              model: 'Team'
            },
            {
              path: 'office',
              model: 'Office'
            }
          ]
        },
      );
    const totalItems = await LeaveRequest.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })

  },
  resetPassword: async (req, res) => {
    await Employee.findByIdAndUpdate(req.params.id, { password: await generatePassword() })
    return
  },

  calcSalaryEmployeeByMonth: async (req, res) => {
    const employeeSalary = new EmployeeSalary(req.body);
    var workingTime = await getWorkingTimeByEmployee(employeeSalary.employee, employeeSalary.month, employeeSalary.year);
    const leaveTime = await getLeaveTimeByEmployee(employeeSalary.employee, employeeSalary.month);
    let salary = await calcSalaryByMonth(employeeSalary, workingTime, leaveTime);

    await EmployeeSalary.findByIdAndUpdate(employeeSalary.id,
      {
        status: 1,
        paidSalary: salary.salary,
        workingDay: workingTime.time / 8,
        updateDate: new Date(),
        transportAllowance: employeeSalary.transportAllowance,
        mealAllowance: employeeSalary.mealAllowance,
        paidDay: employeeSalary.paidDay != workingTime.time / 8 ? employeeSalary.paidDay : workingTime.time / 8,
        taxValue: salary.taxValue,
        taxIncomeRate: salary.taxRate
      })

    return ({
      msg: "Success",
      result: {
        leavePaidDay: leaveTime.paidTime / 8,
        leaveUnpaidDay: leaveTime.unPaidTime / 8,
        paidSalary: salary,
        workingDay: workingTime.time,
      },
    })


  },

  sendEmailPayslip: async (req, res) => {
    const empSalary = await EmployeeSalary.findById(req.params.id).populate("employee");
    await sendPayslipSalary(req.file.buffer, empSalary.employee, empSalary.month, empSalary.year);
    return true
  }
}



const getWorkingTimeByEmployee = async (employeeId, month, year) => {
  // const month = new Date().getMonth() + 1;

  const startOfMonth = new Date(Date.UTC(year, month - 1, 0, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

  const result = await WorkLog.find(
    {
      "employee": employeeId,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth
      }
    }
  );

  var workingTime = 0;
  var otTime = 0;
  if (result) {
    workingTime = result.filter(x => x.status == 1).reduce((a, b) => a + b.time, 0);
    otTime = result.filter(x => x.status == 1).reduce((a, b) => a + (b.otTime * b.otRate), 0);
  }

  return { time: workingTime, otTime };


}

const getLeaveTimeByEmployee = async (employeeId, month) => {
  // const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear(); // Change this to the desired year

  const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

  const result = await LeaveRequest.find(
    {
      "employee": employeeId,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth
      },
      status: Constants.Status.ACTIVE
    }
  ).populate("leaveType");

  var paidTime = 0;
  var unPaidTime = 0;
  if (result) {
    paidTime = result.filter(x => x?.leaveType?.name !== "Unpaid Leave").reduce((a, b) => a + b.timeValue, 0);
    unPaidTime = result.filter(x => x?.leaveType?.name === "Unpaid Leave").reduce((a, b) => a + b.timeValue, 0);
  }

  return { paidTime: paidTime * 8, unPaidTime: unPaidTime * 8 };
}
const calcSalaryByMonth = async (employeeSalary, workingTime, leaveTime) => {
  let salary = 0;
  const workingDayOfMonth = countWorkingDayByMonth();
  const bhxh = 0.105;
  const unitSalary = employeeSalary.contractSalary / (workingDayOfMonth * 8);

  salary = unitSalary * (workingTime.time + leaveTime.paidTime - leaveTime.unPaidTime);
  if (workingTime?.overTime) {
    const OTSalary = workingTime?.overTime * unitSalary;
    salary += OTSalary;
  }
  const taxRate = getTaxRate(salary);

  salary += parseFloat(employeeSalary?.transportAllowance) + parseFloat(employeeSalary?.mealAllowance);

  const taxValue = (salary * bhxh) + (salary * taxRate);

  return { salary: parseFloat(salary).toFixed(0), taxValue: parseFloat(taxValue).toFixed(0), taxRate: taxRate };
}

const countWorkingDayByMonth = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1;
  let count = 0;
  for (let day = 1; day <= new Date(year, month, 0).getDate(); day++)
    count += new Date(year, month - 1, day).getDay() >= 1 && new Date(year, month - 1, day).getDay() <= 5;
  return count;
}

const getTaxRate = (salary) => {
  var result = 0.0;
  if (salary >= 0 && salary <= 5000)
    return result = 0.05;
  else if (salary > 5000 && salary <= 10000)
    return result = 0.1;
  else if (salary > 10000 && salary <= 18000)
    return result = 0.15;
  else if (salary > 18000 && salary <= 32000)
    return result = 0.2;
  else if (salary > 32000 && salary <= 52000)
    return result = 0.25;
  else if (salary > 52000 && salary <= 80000)
    return result = 0.3;
  else if (salary > 80000)
    return result = 0.35;
}


module.exports = employeeServices;
const { Employee } = require("../models/employee")
const generator = require('generate-password');
const { EmployeeLeaveType, LeaveRequest } = require("../models/leaveType");
const { Team, Department } = require("../models/companyModels");

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

const employeeController = {
  addEmployee: async (req, res) => {
    try {
      const newEmployee = new Employee(req.body);
      let uniqueEmail = await Employee.findOne({ email: newEmployee.email });
      if (uniqueEmail) return res.status(400).send("User already registered.");
      const savedEmployee = await newEmployee.save()
      if (savedEmployee) {
        if (savedEmployee.role == EmployeeRole.LEADER) {
          await Team.findByIdAndUpdate(savedEmployee.team, { leader: savedEmployee._id })
        }
        if (savedEmployee.role == EmployeeRole.MANAGER) {
          await Department.findByIdAndUpdate(savedEmployee.department, { manager: savedEmployee._id })
        }
      }
      res.status(200).json(savedEmployee)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  saveImportEmployee: async (req, res) => {
    try {
      const savedEmployee = await Employee.insertMany(req.body);
      res.status(200).json(savedEmployee)
    } catch (error) {
      res.status(500).json(error)

    }
  },
  getAllEmployee: async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id).populate("team").populate("department").populate("office");
      const empLeaveType = await EmployeeLeaveType.find({ employee: req.params.id }).populate("leaveType");
      const reponse = { employeeInfo: employee, leaveType: empLeaveType }
      res.status(200).json(reponse)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateEmployeeById: async (req, res) => {
    try {
      await Employee.findByIdAndUpdate(req.params.id, { $set: req.body })
      const employee = await Employee.findById(req.params.id);
      if (employee) {
        if (employee.role == EmployeeRole.LEADER) {
          await Team.findByIdAndUpdate(employee.team, { leader: employee._id })
        }
        if (employee.role == EmployeeRole.MANAGER) {
          await Department.findByIdAndUpdate(employee.department, { manager: employee._id })
        }
      }
      res.status(200).json(true)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.param.id);

      await employee.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  searchEmployee: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'code',
        sortBy = 'asc',
        keyword
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const role = req.query?.role;
      const status = parseInt(req.query.status) == 0 ? Status.DEACTIVE : Status.ACTIVE;
      const officeId = req.query.officeId || "";
      const departmentId = req.query.departmentId || "";
      const teamId = req.query.teamId || "";

      const skip = (pageIndex - 1) * limit;

      const queries = {
        status: status
      }

      if (keyword) queries.fullName = { $regex: keyword, $options: 'i' }
      if (role) {
        const temp = role.length > 1 ? role.map(item => parseInt(item)) : [parseInt(role)]
        queries.role = { $in: temp }
      }
      const result = await Employee.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy })
        .populate("team").populate("department").populate("office");
      const totalItems = await Employee.countDocuments(queries)


      res.status(200).json({
        msg: "Success",
        result,
        totalItems,
        toltalPage: Math.ceil(totalItems / limit),
        limit: +limit,
        currentPage: pageIndex
      })
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
  getAbsentByDate: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'updateDate',
        sortBy = 'asc',
        keyword,
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
        var start = new Date(dateFrom);
        start.setDate(start.getUTCDate());
        start = new Date(start.setHours(0, 0, 0, 0)).toISOString()
      }
      if (dateTo) {
        var end = new Date(dateTo);
        end.setDate(end.getUTCDate());
        end = new Date(end.setHours(23, 59, 59, 999)).toISOString()
      }

      const queries = {
        // date: {
        //   $gte: start,
        //   $lte: end,
        // }
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

      res.status(200).json({
        msg: "Success",
        result,
        totalItems,
        toltalPage: Math.ceil(totalItems / limit),
        limit: +limit,
        currentPage: pageIndex
      })
    }
    catch (error) {
      res.status(500).json(error)
    }
  },
  resetPassword: async (req, res) => {
    try {
      await Employee.findByIdAndUpdate(req.params.id, { password: generatePassword() })
      res.status(200).json("Success")
    } catch (error) {
      res.status(500).json(error)
    }
  }

}
const generatePassword = (password) => {
  password = generator.generate({
    length: 10,
    uppercase: true,
    lowercase: true,
    numbers: true,
  });
  return password
}

module.exports = employeeController;
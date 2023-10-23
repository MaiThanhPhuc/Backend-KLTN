const { Employee } = require("../models/employee")
const generator = require('generate-password');

const Status = {
  ACTIVE: 0,
  DEACTIVE: 1
}

const employeeController = {
  addEmployee: async (req, res) => {
    try {
      const newEmployee = new Employee(req.body);
      newEmployee.password = generatePassword(newEmployee.password)
      newEmployee.fullName = `${newEmployee.firstName} ${newEmployee.lastName}`
      let uniqueEmail = await Employee.findOne({ email: newEmployee.email });
      if (uniqueEmail) return res.status(400).send("User already registered.");
      const savedEmployee = await newEmployee.save()
      res.status(200).json(savedEmployee)
    } catch (error) {
      res.status(500).json(error);
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
      const employee = await Employee.findById(req.params.id);
      res.status(200).json(employee)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      await employee.updateOne({ $set: req.body })
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
      const status = parseInt(req.query.status) || Status.ACTIVE;
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
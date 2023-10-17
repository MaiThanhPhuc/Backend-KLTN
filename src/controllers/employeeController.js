const { Employee } = require("../models/employee")
const generator = require('generate-password');

const employeeController = {
  addEmployee: async (req, res) => {
    try {
      const newEmployee = new Employee(req.body);
      newEmployee.password = generatePassword(newEmployee.password)
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
      const employee = await Employee.findById(req.param.id);
      res.status(200).json(employee)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findById(req.param.id);
      await employee.updateOne({ $set: req.body })
      res.status(200).json("Success")
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
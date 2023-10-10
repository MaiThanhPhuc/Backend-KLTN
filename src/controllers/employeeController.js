const { Employee } = require("../models/employee")
const generator = require('generate-password');
const { generatePassword } = require("../utils/generatePassword")
const employeeController = {
  addEmployee: async (req, res) => {
    try {
      const newEmployee = new Employee(req.body);
      newEmployee.password = generator.generate({
        length: 10,
        uppercase: true,
        lowercase: true,
        numbers: true,
      });
      const savedEmployee = await newEmployee.save();
      res.status(200).json(savedEmployee.id)
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

module.exports = employeeController;
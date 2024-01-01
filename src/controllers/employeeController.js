const employeeServices = require("../services/employeeServices");

const employeeController = {
  addEmployee: async (req, res) => {
    try {
      const savedEmployee = await employeeServices.addEmployee(req)
      res.status(200).json(savedEmployee)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  saveImportEmployee: async (req, res) => {
    try {
      const savedEmployee = await employeeServices.saveImportEmployee(req.body);
      res.status(200).json(savedEmployee)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  getAllEmployee: async (req, res) => {
    try {
      const employees = await employeeServices.getAllEmployee()
      res.status(200).json(employees)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getEmployeeById: async (req, res) => {
    try {
      const reponse = await employeeServices.getEmployeeById(req)
      res.status(200).json(reponse)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getEmployeeSalary: async (req, res) => {
    try {
      const reponse = await employeeServices.getEmployeeSalary(req)
      res.status(200).json(reponse)
    }
    catch (error) {
      res.status(500).json(error)
    }
  },

  updateEmployeeById: async (req, res) => {
    try {
      await employeeServices.updateEmployeeById(req)
      res.status(200).json(true)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteEmployeeById: async (req, res) => {
    try {
      await employeeServices.deleteEmployeeById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  searchEmployee: async (req, res) => {
    try {
      const result = await employeeServices.searchEmployee(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
  getAbsentByDate: async (req, res) => {
    try {
      const result = await employeeServices.getAbsentByDate(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)
    }
  },
  resetPassword: async (req, res) => {
    try {
      await employeeServices.resetPassword(req)
      res.status(200).json("Success")
    } catch (error) {
      res.status(500).json(error)
    }
  },

  calcSalaryEmployeeByMonth: async (req, res) => {
    try {
      const result = await employeeServices.calcSalaryEmployeeByMonth(req)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  sendEmailPayslip: async (req, res) => {
    try {
      const result = await employeeServices.sendEmailPayslip(req)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  }

}

module.exports = employeeController;
const { Employee } = require("../models/employee")

const authController = {

  handleErrors: (err) => {
    console.log(err.message, err.code);
    let error = {
      email: '',
      passoword: ''
    }

    if (err.code === 11000) {
      error.email = "That email is already registered"
      return error
    }

    return error
  },

  login: async (req, res) => {
    try {
      const newEmployee = new Employee(req.body);
      const savedEmployee = await newEmployee.save();
      res.status(200).json(savedEmployee)
    } catch (error) {
      const errors = this.handleErrors(error)
      res.status(500).json(error);
    }
  },
}

module.exports = authController;
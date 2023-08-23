const { Employee } = require("../models/employee")
const jwt = require('jsonwebtoken')

const maxLife = 3 * 24 * 60 * 60;

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
    const { email, passoword } = req.body;
    try {
      const employee = await new Employee.create({ email, password });
      const token = this.createToken(employee._id)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxLife * 1000 })
      res.status(200).json({ employee: employee._id })
    } catch (error) {
      const errors = this.handleErrors(error)
      res.status(500).json(error);
    }
  },

  createToken: (id) => {
    return jwt.sign({ id }, "kltn", {
      expiresIn: maxLife
    })
  }
}

module.exports = authController;
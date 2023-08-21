const { Department } = require("../models/otherModels")


const departmentController = {
  addDepartment: async (req, res) => {
    try {
      const newDepartment = new Department(req.body);
      const savedDepartment = await newDepartment.save();
      res.status(200).json(savedDepartment)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllDepartment: async (req, res) => {
    try {
      const departments = await Department.find();
      res.status(200).json(departments)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.param.id);
      res.status(200).json(department)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.param.id);
      await department.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteDepartmentById: async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.param.id);

      await department.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  }
}

module.exports = departmentController;
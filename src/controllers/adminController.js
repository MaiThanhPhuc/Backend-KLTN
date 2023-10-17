const { Team, Department, JobLeave, Office } = require("../models/otherModels")


const employeeController = {
  addTeam: async (req, res) => {
    try {
      const today = new Date()
      const request = new Team(req.body);
      request.createdDay = today;
      const saveValue = await request.save();
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllTeam: async (req, res) => {
    try {
      const teams = await Team.find();
      res.status(200).json(teams)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getTeamById: async (req, res) => {
    try {
      const result = await Team.findById(req.param.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateTeamById: async (req, res) => {
    try {
      const result = await Office.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteTeamById: async (req, res) => {
    try {
      const result = await Team.findByIdAndDelete(req.param.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
  /// Office
  addOffice: async (req, res) => {
    try {
      const today = new Date()
      const request = new Office(req.body);
      request.createdDay = today;
      const saveValue = await request.save();
      res.status(200).json(saveValue.id)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllOffice: async (req, res) => {
    try {
      const data = await Office.find();
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getOfficeById: async (req, res) => {
    try {
      const result = await Office.findById(req.param.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateOfficeById: async (req, res) => {
    try {
      const result = await Office.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteOfficeById: async (req, res) => {
    try {
      const result = await Office.findByIdAndDelete(req.param.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  /// Department
  addDepartment: async (req, res) => {
    try {
      const today = new Date()
      const request = new Department(req.body);
      request.createdDay = today
      const saveValue = await request.save();
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllDepartment: async (req, res) => {
    try {
      const data = await Department.find();
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const result = await Department.findById(req.param.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateDepartmentById: async (req, res) => {
    try {
      const result = await Office.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteDepartmentById: async (req, res) => {
    try {
      const result = await Department.findByIdAndDelete(req.param.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  }

}

module.exports = employeeController;
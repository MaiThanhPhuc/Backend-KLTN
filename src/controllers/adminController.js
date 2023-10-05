const { Team, Department, JobLeave, Office } = require("../models/otherModels")


const employeeController = {
  addTeam: async (req, res) => {
    try {
      const request = new Team(req.body);
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
      const result = await Team.findById(req.param.id);
      await result.updateOne({ $set: req.body })
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
  }
}

module.exports = employeeController;
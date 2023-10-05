const { JobLeave } = require("../models/otherModels")


const jobLeaveController = {
  addJobLeave: async (req, res) => {
    try {
      const newJobLeave = new JobLeave(req.body);
      const savedJobLeave = await newJobLeave.save();
      res.status(200).json(savedJobLeave)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllJobLeave: async (req, res) => {
    try {
      const jobLeaves = await JobLeave.find();
      res.status(200).json(jobLeaves)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getJobLeaveById: async (req, res) => {
    try {
      const jobLeave = await JobLeave.findById(req.param.id);
      res.status(200).json(jobLeave)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateJobLeaveById: async (req, res) => {
    try {
      const jobLeave = await JobLeave.findById(req.param.id);
      await jobLeave.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

}

module.exports = jobLeaveController;
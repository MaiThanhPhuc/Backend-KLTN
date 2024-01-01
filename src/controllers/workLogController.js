/* eslint-disable no-unused-vars */
const workLogServices = require("../services/workLogServices");

const workLogController = {
  addWorkLog: async (req, res) => {
    try {
      const saveValue = await workLogServices.addWorkLog(req)
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllWorkLog: async (req, res) => {
    try {
      const result = await workLogServices.getAllWorkLog(req)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getWorkLogById: async (req, res) => {
    try {
      const result = await workLogServices.getWorkLogById(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateWorkLogById: async (req, res) => {
    try {
      await workLogServices.updateWorkLogById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getWorkLogByEmployeeId: async (req, res) => {
    try {

      const result = await workLogServices.getWorkLogByEmployeeId(req)

      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  searchWorkLog: async (req, res) => {
    try {
      const result = await workLogServices.searchWorkLog(req)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  deleteWorkLogById: async (req, res) => {
    try {
      await workLogServices.deleteWorkLogById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
  getWorkLogByMonth: async (req, res) => {
    try {
      const result = await workLogServices.getWorkLogByMonth(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
}

module.exports = workLogController;
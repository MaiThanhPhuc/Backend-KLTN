/* eslint-disable no-unused-vars */
const { LeaveType } = require("../models/leaveType");
const employeeServices = require("../services/employeeServices");
const leaveTypeServices = require("../services/leaveTypeServices");

const leaveTypeController = {
  /// Leave Type
  addLeaveType: async (req, res) => {
    try {

      let checkValid = await LeaveType.findOne({ name: req.body.name });
      if (checkValid) return res.status(400).send("Name already registered.");

      const saveValue = await leaveTypeServices.addLeaveType(req)
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  searchLeaveType: async (req, res) => {
    try {
      const result = await leaveTypeServices.searchLeaveType(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getAllLeaveType: async (req, res) => {
    try {
      const data = await leaveTypeServices.getAllLeaveType(req)
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getLeaveTypeByEmployeeId: async (req, res) => {
    try {
      const data = await leaveTypeServices.getLeaveTypeByEmployeeId(req)
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getLeaveTypeById: async (req, res) => {
    try {
      const result = await leaveTypeServices.getLeaveTypeById(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateLeaveTypeById: async (req, res) => {
    try {
      await leaveTypeServices.updateLeaveTypeById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteLeaveTypeById: async (req, res) => {
    try {

      await leaveTypeServices.deleteLeaveTypeById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  addEmployeeLeaveType: async (req, res) => {
    try {
      await leaveTypeServices.addEmployeeLeaveType(req)
      res.status(200).json("Success")
    } catch (error) {
      res.status(500).json(error)
    }
  },

  updateEmployeeLeaveTypeById: async (req, res) => {
    try {
      await employeeServices.updateEmployeeById(req)
      res.status(200).json("Success")
    } catch (error) {
      res.status(500).json(error)
    }
  },

  createLeaveRequest: async (req, res) => {
    try {
      const result = await leaveTypeServices.createLeaveRequest(req)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  updateLeaveRequestById: async (req, res) => {
    try {

      const result = await leaveTypeServices.updateLeaveRequestById(req)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  updateLeaveRequestByApprovalId: async (req, res) => {
    try {
      await leaveTypeServices.updateLeaveRequestByApprovalId(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getLeaveRequest: async (req, res) => {
    try {
      const result = await leaveTypeServices.getLeaveRequest(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getLeaveRequestByApprove: async (req, res) => {
    try {
      const result = await leaveTypeServices.getLeaveRequestByApprove(req)

      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getLeaveRequestHistory: async (req, res) => {
    try {
      const result = await leaveTypeServices.getLeaveRequestHistory(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
  getAbsentByDate: async (req, res) => {
    try {
      const result = await leaveTypeServices.getAbsentByDate(req)

      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)
    }
  },

  getLeaveRequestById: async (req, res) => {
    try {
      const result = await leaveTypeServices.getLeaveRequestById(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)
    }
  }

};

module.exports = leaveTypeController;
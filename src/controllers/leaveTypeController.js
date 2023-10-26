const { LeaveType, EmployeeLeaveType } = require("../models/leaveType");

const Status = {
  ACTIVE: 0,
  DEACTIVE: 1
}

const leaveTypeController = {
  /// Leave Type
  addLeaveType: async (req, res) => {
    try {
      const today = new Date()
      const request = new LeaveType(req.body);
      let checkValid = await LeaveType.findOne({ name: request.name });
      if (checkValid) return res.status(400).send("Name already registered.");
      request.updateDate = today
      request.status = Status.ACTIVE;
      const saveValue = await request.save();
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  searchLeaveType: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'code',
        sortBy = 'asc',
        keyword
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const status = parseInt(req.query.status) || Status.ACTIVE;
      const skip = (pageIndex - 1) * limit;

      const queries = {
        status: status
      }

      if (keyword) queries.name = { $regex: keyword, $options: 'i' }

      const result = await LeaveType.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy });
      const totalItems = await LeaveType.countDocuments(queries)

      res.status(200).json({
        msg: "Success",
        result,
        totalItems,
        toltalPage: Math.ceil(totalItems / limit),
        limit: +limit,
        currentPage: pageIndex
      })
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getAllLeaveType: async (req, res) => {
    try {
      const data = await LeaveType.find();
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getLeaveTypeById: async (req, res) => {
    try {
      const result = await LeaveType.findById(req.param.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateLeaveTypeById: async (req, res) => {
    try {
      req.body.updateDate = today;
      const result = await LeaveType.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteLeaveTypeById: async (req, res) => {
    try {
      req.body.updateDate = today;
      const result = await LeaveType.findByIdAndDelete(req.param.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  addEmployeeLeaveType: async (req, res) => {
    try {
      var request = new EmployeeLeaveType(req.body)
      const saveValue = await request.save();
      res.status(200).json(saveValue)
      res.status(200).json("Success")
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = leaveTypeController;
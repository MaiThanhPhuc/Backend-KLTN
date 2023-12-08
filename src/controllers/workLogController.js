const { WorkLog } = require("../models/workLog");

const workLogController = {
  addWorkLog: async (req, res) => {
    try {
      const request = new WorkLog(req.body);
      request.updateDate = new Date();
      const saveValue = await request.save();
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllWorkLog: async (req, res) => {
    try {
      const result = await WorkLog.find().populate("employee");
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getWorkLogById: async (req, res) => {
    try {
      const result = await WorkLog.findById(req.params.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateWorkLogById: async (req, res) => {
    try {
      req.body.updateDate = new Date();
      await WorkLog.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  searchWorkLog: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'code',
        sortBy = 'asc',
        keyword
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const skip = (pageIndex - 1) * limit;

      const queries = {
      }

      const result = await WorkLog.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate("employee");
      const totalItems = await WorkLog.countDocuments(queries)

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

  deleteWorkLogById: async (req, res) => {
    try {
      req.body.updateDate = new Date();
      await WorkLog.findByIdAndDelete(req.params.id);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
  getWorkLogByMonth: async (req, res) => {
    try {
      const desiredMonth = req.query.month; // Change this to the desired month
      const year = new Date().getFullYear(); // Change this to the desired year

      const startOfMonth = new Date(Date.UTC(year, desiredMonth - 1, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, desiredMonth, 1, 0, 0, 0));

      endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

      const result = await WorkLog.aggregate([
        {
          $match: {
            date: {
              $gte: startOfMonth,
              $lt: endOfMonth
            }
          }
        }]);

      res.status(200).json({
        msg: "Success",
        result,
      })
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
}

module.exports = workLogController;
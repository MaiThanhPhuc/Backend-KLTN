const { WorkLog } = require("../models/workLog");
var mongoose = require('mongoose');

const WorkLogStatus = {
  INVALID: 0,
  VALID: 1,
  PENDING: 2,
}

const WorkLogType = {
  WORKING: 0,
  TRAINING: 1,
}

const workLogController = {
  addWorkLog: async (req, res) => {
    try {
      const request = new WorkLog(req.body);
      request.updateDate = new Date();
      request.status = checkValidStatus(req.body);
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

  getDetailWorkLogByEmployeeId: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'date',
        sortBy = 'desc',
        employeeId
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const skip = (pageIndex - 1) * limit;

      const queries = {
        employee: employeeId
      }

      const result = await WorkLog.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate(
        {
          path: 'employee',
          populate: [
            {
              path: 'team',
              model: 'Team'
            },
          ]
        },
      );
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

  searchWorkLog: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'date',
        sortBy = 'desc',
        employeeId
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const skip = (pageIndex - 1) * limit;

      const result = await WorkLog.aggregate([
        {
          $group: {
            _id: "$employee",
            totalWorkingTime: { $sum: "$time" },
            otTime: { $sum: "$otTime" },
          }
        },
        {
          $lookup: {
            from: "employees",
            localField: "_id",
            foreignField: "_id",
            as: "employee",
          }
        },
        {
          $project: {
            _id: 1,
            totalWorkingTime: 1,
            otTime: 1,
            employee: {
              $filter: {
                input: "$employee",
                cond: {
                  $eq: ["$$employee.team", mongoose.Types.ObjectId(teamId)]
                }
              }
            },
          }
        },
        {
          $sort: {
            [orderBy]: sortBy
          }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ])
      const totalItems = await WorkLog.countDocuments(queries)

      res.status(200).json({
        msg: "Success",
        result,
        totalItems,
        toltalPage: Math.ceil(totalItems / limit),
        limit: +limit,
        currentPage: pageIndex
      })
    } catch (error) {
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
      const result = await WorkLog.find(
        {
          "employee": req.query.userId,
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      );

      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
}

checkValidStatus = (body) => {
  const date = new Date(body.date);
  if (date.getDay() >= 1 && date.getDay() <= 5 && (body.time >= 0 || body.time <= 8)) { // Monday is 1 and Friday is 5
    return WorkLogStatus.VALID;
  } else {
    return WorkLogStatus.INVALID;
  }
}

module.exports = workLogController;
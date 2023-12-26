const { EmployeeSalary, Employee } = require("../models/employee");
const { WorkLog } = require("../models/workLog");
var mongoose = require('mongoose');

const WorkLogStatus = {
  INVALID: 0,
  VALID: 1,
  PENDING: 2,
}

const workLogController = {
  addWorkLog: async (req, res) => {
    try {
      const request = new WorkLog(req.body);
      request.updateDate = new Date();
      request.status = checkValidStatus(req.body);
      const saveValue = await request.save();
      const existsRecord = await EmployeeSalary.findOne(
        {
          employee: req.body.employee,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        });
      if (!existsRecord) {
        const emp = await Employee.findById(req.body.employee);
        const empSalary = new EmployeeSalary();
        empSalary.employee = req.body.employee;
        empSalary.contractSalary = emp.salary;
        empSalary.month = new Date().getMonth() + 1;
        empSalary.year = new Date().getFullYear();
        empSalary.updateDate = new Date();
        empSalary.status = 0;
        empSalary.workingDayOfMonth = countWorkingDayByMonth();
        const empSalaryValue = await empSalary.save();
        await Employee.updateOne(
          { "_id": req.body.employee },
          {
            $push: {
              "employeeSalary": new mongoose.Types.ObjectId(empSalaryValue._id)
            }
          });
      }

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

  getWorkLogByEmployeeId: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'date',
        sortBy = 'desc',
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const skip = (pageIndex - 1) * limit;

      const desiredMonth = req.query.month; // Change this to the desired month
      const year = new Date().getFullYear(); // Change this to the desired year

      const startOfMonth = new Date(Date.UTC(year, desiredMonth - 1, 0, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, desiredMonth, 1, 0, 0, 0));

      endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

      const queries = {
        "employee": req.query.employeeId,
        date: {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
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

      const totalWorkingTime = (await WorkLog.find(queries)).filter(x => x.status == 1).reduce((a, b) => a + b.time, 0);

      const totalItems = await WorkLog.countDocuments(queries)

      res.status(200).json({
        msg: "Success",
        totalWorkingTime,
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
        keyword
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const skip = (pageIndex - 1) * limit;
      const teamId = req.query.teamId;
      const departmentId = req.query.departmentId;
      const officeId = req.query.officeId;
      const desiredMonth = req.query.month;

      const year = new Date().getFullYear();
      const startOfMonth = new Date(Date.UTC(year, desiredMonth - 1, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, desiredMonth, 1, 0, 0, 0));
      endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

      let pipeline = [
        {
          $match: {
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }
        },
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
            as: "employeeInfo",
          }
        },
        {
          $unwind: '$employeeInfo'
        },
        {
          $lookup: {
            from: "employeesalaries",
            localField: "_id",
            foreignField: "employee",
            as: "empSalary",
          }
        },
        {
          $unwind: '$empSalary'
        },
        {
          $lookup: {
            from: "teams",
            localField: "employeeInfo.team",
            foreignField: "_id",
            as: "team",
          }
        },
        {
          $unwind: '$team'
        },
        {
          $addFields: {
            'teamName': '$team.name'
          }
        },
        {
          $match: {
            'empSalary.month': parseInt(desiredMonth),
            'empSalary.year': parseInt(year),
          }
        },
        {
          $project: {
            'team': 0
          }
        }
      ]

      if (teamId) {
        pipeline.push({
          $match: {
            'employeeInfo.team': new mongoose.Types.ObjectId(teamId),
          }
        });
      }

      if (departmentId) {
        pipeline.push({
          $match: {
            'employeeInfo.department': new mongoose.Types.ObjectId(departmentId),
          }
        });
      }

      if (officeId) {
        pipeline.push({
          $match: {
            'employeeInfo.office': new mongoose.Types.ObjectId(officeId),
          }
        });
      }

      if (keyword) {
        pipeline.push({
          $match: {
            'employeeInfo.fullName': { $regex: new RegExp(keyword, 'i') },
          }
        });
      }

      const countPipeline = [...pipeline, { $count: 'totalItems' }];
      const [countResult] = await WorkLog.aggregate(countPipeline);
      const totalItems = countResult ? countResult.totalItems : 0;

      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });

      const result = await WorkLog.aggregate(pipeline);

      res.status(200).json({
        msg: "Success",
        result,
        totalItems,
        totalPage: Math.ceil(totalItems / limit),
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

      const startOfMonth = new Date(Date.UTC(year, desiredMonth - 1, 0, 0, 0, 0));
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

const checkValidStatus = (body) => {
  const date = new Date(body.date);
  if (date.getDay() >= 1 && date.getDay() <= 5 && (body.time >= 0 || body.time <= 8)) { // Monday is 1 and Friday is 5
    return WorkLogStatus.VALID;
  } else {
    return WorkLogStatus.INVALID;
  }
}

const countWorkingDayByMonth = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1;
  let count = 0;
  for (let day = 1; day <= new Date(year, month, 0).getDate(); day++)
    count += new Date(year, month - 1, day).getDay() >= 1 && new Date(year, month - 1, day).getDay() <= 5;
  return count;
}

module.exports = workLogController;
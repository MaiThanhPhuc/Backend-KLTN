/* eslint-disable no-unused-vars */
const { Employee } = require("../models/employee");
const { LeaveType, EmployeeLeaveType, LeaveRequest } = require("../models/leaveType");
const { Team, Department } = require("../models/companyModels");
const Constants = require("../models/contants");
const { sendNotificationLeaveRequest } = require("./emailServices");

const leaveTypeServices = {
  /// Leave Type
  addLeaveType: async (req, res) => {

    const today = new Date()
    const request = new LeaveType(req.body);
    request.updateDate = today
    request.status = Constants.Status.ACTIVE;
    const saveValue = await request.save();
    return (saveValue)
  },

  searchLeaveType: async (req, res) => {

    const {
      limit = 5,
      orderBy = 'code',
      sortBy = 'asc',
      keyword
    } = req.query
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const status = parseInt(req.query.status) == 0 ? Constants.Status.DEACTIVE : Constants.Status.ACTIVE;
    const skip = (pageIndex - 1) * limit;

    const queries = {
      status: status
    }

    if (keyword) queries.name = { $regex: keyword, $options: 'i' }

    const result = await LeaveType.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy });
    const totalItems = await LeaveType.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })

  },

  getAllLeaveType: async (req, res) => {
    const data = await LeaveType.find();
    return data
  },

  getLeaveTypeByEmployeeId: async (req, res) => {
    const data = await EmployeeLeaveType.find({ employee: req.params.id }).populate("leaveType");
    return (data)
  },

  getLeaveTypeById: async (req, res) => {
    const result = await LeaveType.findById(req.param.id);
    return (result)
  },

  updateLeaveTypeById: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    await LeaveType.findByIdAndUpdate(req.params.id, req.body);
    return ("Success")
  },

  deleteLeaveTypeById: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    const result = await LeaveType.findByIdAndDelete(req.param.id);
    await result.updateOne({ $set: req.body })
    return ("Success")
  },

  addEmployeeLeaveType: async (req, res) => {
    await EmployeeLeaveType.create(req.body);
    return ("Success")
  },

  updateEmployeeLeaveTypeById: async (req, res) => {
    await EmployeeLeaveType.findByIdAndUpdate(req.body._id, req.body)
    return ("Success")
  },

  createLeaveRequest: async (req, res) => {
    const today = new Date()
    const request = new LeaveRequest(req.body);
    request.status = Constants.StatusRequest.PENDING;
    request.updateDate = today;
    const timeValue = getTimeValue(req.body.time)
    request.timeValue = timeValue;
    var approval = await getAprrovalById(req.body.employee)
    request.approvalStatus = approval
    const result = await request.save();

    const employeeLeave = await EmployeeLeaveType.findOne({
      employee: req.body.employee,
      leaveType: req.body.leaveType,
    })
    const taken = employeeLeave.taken + timeValue;
    await EmployeeLeaveType.findByIdAndUpdate(employeeLeave._id, { taken: taken, updateDate: today });
    const dataLeaveRequest = await LeaveRequest.findById(result.id).populate("employee").populate("leaveType").populate('approvalStatus.employee');
    await sendNotificationLeaveRequest(dataLeaveRequest);
    return (result)
  },

  updateLeaveRequestById: async (req, res) => {

    const today = new Date()
    const leaveRequest = new LeaveRequest(req.body);
    const employeeLeave = await EmployeeLeaveType.findOne({
      employee: leaveRequest.employee,
      leaveType: leaveRequest.leaveType,
    })
    if (!employeeLeave) return res.status(500).json("Error")
    const taken = employeeLeave.taken - leaveRequest.timeValue;

    await EmployeeLeaveType.findByIdAndUpdate(employeeLeave._id, { taken: taken, updateDate: today });
    const result = await LeaveRequest.findByIdAndUpdate(req.params.id, { status: Constants.StatusRequest.CANCELLED });
    return (result)
  },

  updateLeaveRequestByApprovalId: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    await LeaveRequest.findByIdAndUpdate(req.params.id, req.body);
    var checkApprove = await LeaveRequest.findById(req.params.id)
    if (checkApprove) {
      if (checkApprove.approvalStatus.every(item => item.status == Constants.StatusRequest.APPROVED)) {
        await LeaveRequest.findByIdAndUpdate(req.params.id, { status: Constants.StatusRequest.APPROVED })
      }
      if (checkApprove.approvalStatus.every(item => item.status == Constants.StatusRequest.REJECT)) {
        await LeaveRequest.findByIdAndUpdate(req.params.id, { status: Constants.StatusRequest.REJECT })
      }
    }
    return ("Success")
  },

  getLeaveRequest: async (req, res) => {
    const {
      limit = 5,
      orderBy = 'updateDate',
      sortBy = -1,
      employeeId
    } = req.query
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const skip = (pageIndex - 1) * limit;

    const desiredMonth = req.query.month; // Change this to the desired month
    const year = req.query.year; // Change this to the desired year

    const startOfMonth = new Date(Date.UTC(year, desiredMonth - 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, desiredMonth, 1, 0, 0, 0));

    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    const queries = {
      employee: employeeId,

    }
    if (desiredMonth) {
      queries.date = {
        $gte: startOfMonth,
        $lt: endOfMonth
      }
    }

    const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate("employee").populate("leaveType");
    const totalItems = await LeaveRequest.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })
  },

  getLeaveRequestByApprove: async (req, res) => {

    const {
      limit = 5,
      orderBy = 'updateDate',
      sortBy = 'asc',
      employeeId
    } = req.query
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const skip = (pageIndex - 1) * limit;

    const queries = {
      "approvalStatus": {
        $elemMatch: {
          "employee": employeeId,
          "status": Constants.StatusRequest.WAITING
        }
      },
      "status": Constants.StatusRequest.PENDING
    }

    const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate(
      {
        path: 'employee',
        populate: [
          {
            path: 'department',
            model: 'Department'
          },
          {
            path: 'team',
            model: 'Team'
          },
          {
            path: 'office',
            model: 'Office'
          }
        ]
      },
    ).populate("leaveType");
    const totalItems = await LeaveRequest.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })
  },

  getLeaveRequestHistory: async (req, res) => {

    const {
      limit = 5,
      orderBy = 'updateDate',
      sortBy = 'asc',
      employeeId
    } = req.query
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const skip = (pageIndex - 1) * limit;

    const queries = {
      employee: employeeId,
      status: Constants.StatusRequest.APPROVED
    }

    const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate(
      {
        path: 'employee',
        populate: [
          {
            path: 'department',
            model: 'Department'
          },
          {
            path: 'team',
            model: 'Team'
          },
          {
            path: 'office',
            model: 'Office'
          }
        ]
      },
    ).populate('leaveType');
    const totalItems = await LeaveRequest.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })
  },
  getAbsentByDate: async (req, res) => {

    const {
      limit = 5,
      orderBy = 'updateDate',
      sortBy = 'asc',
      keyword,
      date
    } = req.query
    const pageIndex = parseInt(req.query.pageIndex) || 1;
    const skip = (pageIndex - 1) * limit;
    const queries = {};
    if (keyword) queries.name = { $regex: keyword, $options: 'i' }
    queries.date = date
    const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy });
    const totalItems = await LeaveRequest.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })


  },

  getLeaveRequestById: async (req, res) => {

    const result = await LeaveRequest.findById(req.params.id).populate('employee').populate('leaveType').populate('approvalStatus.employee');
    return (result)
  }

};

const getTimeValue = (key) => {
  var result = 0;
  switch (key) {
    case Constants.LeaveTimeType.AFTERNOON_SHIFT:
      result = Constants.LeaveTimeValue.AFTERNOON_SHIFT
      break;
    case Constants.LeaveTimeType.MORNING_SHIFT:
      result = Constants.LeaveTimeValue.MORNING_SHIFT
      break;
    case Constants.LeaveTimeType.HALF_DAY:
      result = Constants.LeaveTimeValue.HALF_DAY
      break;
    default:
      result = Constants.LeaveTimeValue.ALL_DAY
      break;
  }
  return result;
};

const getAprrovalById = async (employeeId) => {
  const employee = await Employee.findById(employeeId)
  var approvalId = [];
  var team;
  var department;
  if (employee.role !== Constants.EmployeeRole.LEADER) team = await Team.findById(employee.team)
  if (employee.role !== Constants.EmployeeRole.MANAGER) department = await Department.findById(employee.department)

  const human_resource = await Employee.findOne({ role: Constants.EmployeeRole.HUMAN_RESOURCE })

  if (team?.leader) approvalId.push(team.leader)
  if (department?.manager) approvalId.push(department.manager)
  approvalId.push(human_resource?._id)


  return approvalId.map(item => {
    return {
      employee: item,
      status: Constants.StatusRequest.WAITING,
    }
  })

}

module.exports = leaveTypeServices;
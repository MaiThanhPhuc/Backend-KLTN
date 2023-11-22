const { Employee } = require("../models/employee");
const { LeaveType, EmployeeLeaveType, LeaveRequest } = require("../models/leaveType");
const { Team, Department } = require("../models/companyModels");

const Status = {
  ACTIVE: 1,
  DEACTIVE: 0
}

const StatusRequest = {
  CANCELLED: 0,
  PENDING: 1,
  APPROVED: 2,
  WAITING: 3,
}

const LeaveTimeType = {
  ALL_DAY: 0,
  MORNING_SHIFT: 1,
  AFTERNOON_SHIFT: 2,
  HALF_DAY: 3,
}

const LeaveTimeValue = {
  ALL_DAY: 1,
  MORNING_SHIFT: 0.375,
  AFTERNOON_SHIFT: 0.625,
  HALF_DAY: 0.5,
}

const EmployeeRole = {
  ADMIN: 0,
  HUMAN_RESOURCE: 1,
  MANAGER: 2,
  LEADER: 3,
  MEMBER: 4,
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
      const status = parseInt(req.query.status) == 0 ? Status.DEACTIVE : Status.ACTIVE;
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
      const today = new Date()
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
      const today = new Date()
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
      await EmployeeLeaveType.create(req.body);
      res.status(200).json("Success")
    } catch (error) {
      res.status(500).json(error)
    }
  },

  updateEmployeeLeaveTypeById: async (req, res) => {
    try {
      await EmployeeLeaveType.findByIdAndUpdate(req.body._id, req.body)
      res.status(200).json("Success")
    } catch (error) {
      res.status(500).json(error)
    }
  },

  createLeaveRequest: async (req, res) => {
    try {
      const today = new Date()
      const request = new LeaveRequest(req.body);
      request.status = StatusRequest.PENDING;
      request.updateDate = today;
      const timeValue = getTimeValue(req.body.timeType)
      request.timeValue = timeValue;
      var approval = await getAprrovalById(req.body.employee)
      request.approvalStatus = approval
      const result = await request.save();
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  updateLeaveRequestById: async (req, res) => {
    try {
      const today = new Date()
      req.body.updateDate = today;
      const result = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body);
      if (result) {
        if (result.approvalStatus.every(item => item.status == StatusRequest.APPROVED)) {
          var employeeLeave = await EmployeeLeaveType.findOne({
            employee: req.body.employee,
            leaveType: req.body.leaveType,
          })

          employeeLeave.taken = employeeLeave.taken + timeValue
          employeeLeave.total = employeeLeave.total - timeValue
          await EmployeeLeaveType.findByIdAndUpdate(employeeLeave._id, employeeLeave)
          await LeaveRequest.findByIdAndUpdate(req.params.id, { status: StatusRequest.APPROVED })
        }

      }
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getLeaveRequest: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'updateDate',
        sortBy = -1,
        employeeId
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const skip = (pageIndex - 1) * limit;

      const queries = {
        employee: employeeId
      }

      const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate("employee").populate("leaveType");
      const totalItems = await LeaveRequest.countDocuments(queries)

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

  getLeaveRequestByApprove: async (req, res) => {
    try {
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
            "_id": employeeId
          }
        },
        "status": StatusRequest.WAITING
      }

      const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate("employee").populate("leaveType");
      const totalItems = await LeaveRequest.countDocuments(queries)

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

  getLeaveRequestHistory: async (req, res) => {
    try {
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
        status: StatusRequest.APPROVED
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
  getAbsentByDate: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'updateDate',
        sortBy = 'asc',
        keyword,
        date
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const skip = (pageIndex - 1) * limit;
      if (keyword) queries.name = { $regex: keyword, $options: 'i' }
      queries.date = date
      const result = await LeaveRequest.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy });
      const totalItems = await LeaveRequest.countDocuments(queries)

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

  getLeaveRequestById: async (req, res) => {
    try {
      const result = await LeaveRequest.findById(req.params.id).populate('employee').populate('leaveType').populate('approvalStatus.employee');
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)
    }
  }

};

const getTimeValue = (key) => {
  var result = 0;
  switch (key) {
    case LeaveTimeType.AFTERNOON_SHIFT:
      result = LeaveTimeValue.AFTERNOON_SHIFT
      break;
    case LeaveTimeType.MORNING_SHIFT:
      result = LeaveTimeValue.MORNING_SHIFT
      break;
    case LeaveTimeType.HALF_DAY:
      result = LeaveTimeValue.HALF_DAY
      break;
    default:
      result = LeaveTimeValue.ALL_DAY
      break;
  }
  return result;
};

const getAprrovalById = async (employeeId) => {
  const employee = await Employee.findById(employeeId)
  var approvalId = [];
  const team = await Team.findById(employee.team)
  const department = await Department.findById(employee.department)
  const human_resource = await Employee.findOne({ role: EmployeeRole.HUMAN_RESOURCE })
  approvalId = [department.manager, team.leader, human_resource?._id]

  return approvalId.map(item => {
    return {
      employee: item,
      status: StatusRequest.WAITING,
    }
  })

}

module.exports = leaveTypeController;
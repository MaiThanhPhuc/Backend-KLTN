const Constants = {
  Status: {
    ACTIVE: 1,
    DEACTIVE: 0
  },
  Role: {
    ADMIN: 0,
    USER: 1
  },

  EmployeeRole: {
    ADMIN: 0,
    HUMAN_RESOURCE: 1,
    MANAGER: 2,
    LEADER: 3,
    MEMBER: 4,
  },

  StatusRequest: {
    CANCELLED: 0,
    PENDING: 1,
    APPROVED: 2,
    WAITING: 3,
    REJECT: 4
  },
  LeaveTimeType: {
    ALL_DAY: 0,
    MORNING_SHIFT: 1,
    AFTERNOON_SHIFT: 2,
    HALF_DAY: 3,
  },

  LeaveTimeValue: {
    ALL_DAY: 1,
    MORNING_SHIFT: 0.375,
    AFTERNOON_SHIFT: 0.625,
    HALF_DAY: 0.5,
  },

  WorkLogStatus: {
    INVALID: 0,
    VALID: 1,
    PENDING: 2,
  }

}

module.exports = Constants;
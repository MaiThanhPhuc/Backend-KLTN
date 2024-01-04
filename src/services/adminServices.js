/* eslint-disable no-unused-vars */
const { Employee } = require("../models/employee");
const { Team, Department, Office } = require("../models/companyModels");
const Constants = require("../models/contants");

const adminServices = {
  addTeam: async (req) => {
    const today = new Date()
    const request = new Team(req.body);
    request.updateDate = today;
    request.status = Constants.Status.ACTIVE;
    const saveValue = await request.save();
    return saveValue
  },

  getAllTeam: async () => {
    return await Team.find({ status: Constants.Status.ACTIVE }).populate("department").populate("leader");
  },

  getTeamById: async (req, res) => {
    const result = await Team.findById(req.params.id);
    return result
  },

  updateTeamById: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    const result = await Team.findByIdAndUpdate(req.params.id, req.body);
    if (result.leader) {
      await Employee.findByIdAndUpdate(result.leader, { team: result._id })
    }
    return
  },

  searchTeam: async (req, res) => {
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

    const result = await Team.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy }).populate("leader")
      .populate("department");
    const totalItems = await Team.countDocuments(queries)

    return {
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    }
  },

  deleteTeamById: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    const result = await Team.findByIdAndDelete(req.params.id);

    await result.updateOne({ $set: req.body })
    return
  },
  /// Office
  addOffice: async (req, res) => {
    const today = new Date()
    const request = new Office(req.body);
    request.updateDate = today;
    request.status = Constants.Status.ACTIVE;
    const saveValue = await request.save();
    return (saveValue.id)
  },

  getAllOffice: async (req, res) => {
    const data = await Office.find({ status: Constants.Status.ACTIVE });
    return (data)
  },

  searchOffice: async (req, res) => {
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

    const result = await Office.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy });
    const totalItems = await Office.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })
  },

  getOfficeById: async (req, res) => {
    const result = await Office.findById(req.params.id);
    return (result)
  },

  updateOfficeById: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    await Office.findByIdAndUpdate(req.params.id, req.body);
    return
  },

  deleteOfficeById: async (req, res) => {
    const today = new Date()
    const result = await Office.findByIdAndDelete(req.params.id);
    req.body.updateDate = today;
    await result.updateOne({ $set: req.body })
    return
  },

  /// Department
  addDepartment: async (req, res) => {
    const today = new Date()
    const request = new Department(req.body);

    request.updateDate = today
    request.status = Constants.Status.ACTIVE;
    const saveValue = await request.save();
    return (saveValue)
  },

  searchDepartment: async (req, res) => {
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

    const result = await Department.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy })
      .populate("office").populate("manager");
    const totalItems = await Department.countDocuments(queries)

    return ({
      msg: "Success",
      result,
      totalItems,
      toltalPage: Math.ceil(totalItems / limit),
      limit: +limit,
      currentPage: pageIndex
    })
  },

  getAllDepartment: async (req, res) => {
    const data = await Department.find({ status: Constants.Status.ACTIVE }).populate("office").populate("manager");
    return (data)
  },

  getDepartmentById: async (req, res) => {
    const result = await Department.findById(req.params.id);
    const team = await Team.find({ department: req.params.id });
    result.team = team;
    return (result)
  },

  updateDepartmentById: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    const result = await Department.findByIdAndUpdate(req.params.id, req.body);
    if (result.manager) {
      await Employee.findByIdAndUpdate(result.manager, { manager: result._id })
    }
    return
  },

  deleteDepartmentById: async (req, res) => {
    const today = new Date()
    req.body.updateDate = today;
    const result = await Department.findByIdAndDelete(req.params.id);

    await result.updateOne({ $set: req.body })
    return
  }
}

module.exports = adminServices;
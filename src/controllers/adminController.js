const { Team, Department, JobLeave, Office } = require("../models/otherModels")


const employeeController = {
  addTeam: async (req, res) => {
    try {
      const today = new Date()
      const request = new Team(req.body);
      request.createdDay = today;
      const saveValue = await request.save();
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllTeam: async (req, res) => {
    try {
      const teams = await Team.find().populate("department").populate("leader");
      res.status(200).json(teams)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getTeamById: async (req, res) => {
    try {
      const result = await Team.findById(req.param.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateTeamById: async (req, res) => {
    try {
      const result = await Office.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  searchTeam: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'code',
        sortBy = 'asc',
        keyword
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;

      const skip = (pageIndex - 1) * limit;

      const queries = {}

      if (keyword) queries.name = { $regex: keyword, $options: 'i' }

      const result = await Team.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy })
        .populate("department").populate("leader");
      const totalItems = await Team.countDocuments(queries)

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

  deleteTeamById: async (req, res) => {
    try {
      const result = await Team.findByIdAndDelete(req.param.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },
  /// Office
  addOffice: async (req, res) => {
    try {
      const today = new Date()
      const request = new Office(req.body);
      request.createdDay = today;
      const saveValue = await request.save();
      res.status(200).json(saveValue.id)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllOffice: async (req, res) => {
    try {
      const data = await Office.find();
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  searchOffice: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'code',
        sortBy = 'asc',
        keyword
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;

      const skip = (pageIndex - 1) * limit;

      const queries = {}

      if (keyword) queries.name = { $regex: keyword, $options: 'i' }

      const result = await Office.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy });
      const totalItems = await Office.countDocuments(queries)

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

  getOfficeById: async (req, res) => {
    try {
      const result = await Office.findById(req.param.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateOfficeById: async (req, res) => {
    try {
      const result = await Office.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteOfficeById: async (req, res) => {
    try {
      const result = await Office.findByIdAndDelete(req.param.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  /// Department
  addDepartment: async (req, res) => {
    try {
      const today = new Date()
      const request = new Department(req.body);
      request.createdDay = today
      const saveValue = await request.save();
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  searchDepartment: async (req, res) => {
    try {
      const {
        limit = 5,
        orderBy = 'code',
        sortBy = 'asc',
        keyword
      } = req.query
      const pageIndex = parseInt(req.query.pageIndex) || 1;

      const skip = (pageIndex - 1) * limit;

      const queries = {}

      if (keyword) queries.name = { $regex: keyword, $options: 'i' }

      const result = await Department.find(queries).skip(skip).limit(limit).sort({ [orderBy]: sortBy })
        .populate("office").populate("manager");
      const totalItems = await Department.countDocuments(queries)

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

  getAllDepartment: async (req, res) => {
    try {
      const data = await Department.find().populate("office").populate("manager");
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const result = await Department.findById(req.param.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateDepartmentById: async (req, res) => {
    try {
      const result = await Office.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteDepartmentById: async (req, res) => {
    try {
      const result = await Department.findByIdAndDelete(req.param.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  }

}

module.exports = employeeController;
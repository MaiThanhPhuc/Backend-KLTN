const { Team, Department, Office } = require("../models/otherModels")

const Status = {
  ACTIVE: 0,
  DEACTIVE: 1
}

const employeeController = {
  addTeam: async (req, res) => {
    try {
      const today = new Date()
      const request = new Team(req.body);
      request.updateDate = today;
      request.status = Status.ACTIVE;
      let checkValid = await Team.findOne({ name: request.name });
      if (checkValid) return res.status(400).send("Name already registered.");
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
      const result = await Team.findById(req.params.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateTeamById: async (req, res) => {
    try {
      const today = new Date()
      req.body.updateDate = today;
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
      const status = parseInt(req.query.status) || Status.ACTIVE;
      const skip = (pageIndex - 1) * limit;

      const queries = {
        status: status
      }

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
      const today = new Date()
      req.body.updateDate = today;
      const result = await Team.findByIdAndDelete(req.params.id);

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
      request.updateDate = today;
      request.status = Status.ACTIVE;
      let checkValid = await Office.findOne({ name: request.name });
      if (checkValid) return res.status(400).send("Name already registered.");
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
      const status = parseInt(req.query.status) || Status.ACTIVE;
      const skip = (pageIndex - 1) * limit;

      const queries = {
        status: status
      }

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
      const result = await Office.findById(req.params.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateOfficeById: async (req, res) => {
    try {
      const today = new Date()
      req.body.updateDate = today;
      const result = await Office.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteOfficeById: async (req, res) => {
    try {
      const today = new Date()
      const result = await Office.findByIdAndDelete(req.params.id);
      req.body.updateDate = today;
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
      let checkValid = await Department.findOne({ name: request.name });
      if (checkValid) return res.status(400).send("Name already registered.");
      request.updateDate = today
      request.status = Status.ACTIVE;
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
      const status = parseInt(req.query.status) || Status.ACTIVE;
      const skip = (pageIndex - 1) * limit;

      const queries = {
        status: status
      }

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
      const result = await Department.findById(req.params.id);
      const team = await Team.find({ department: req.params.id });
      result.team = team;
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateDepartmentById: async (req, res) => {
    try {
      const today = new Date()
      req.body.updateDate = today;
      const result = await Department.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteDepartmentById: async (req, res) => {
    try {
      const today = new Date()
      req.body.updateDate = today;
      const result = await Department.findByIdAndDelete(req.params.id);

      await result.updateOne({ $set: req.body })
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  }
}

module.exports = employeeController;
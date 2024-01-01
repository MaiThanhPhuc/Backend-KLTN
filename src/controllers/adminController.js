/* eslint-disable no-unused-vars */

const { Team, Office, Department } = require("../models/companyModels");
const adminServices = require("../services/adminServices");

const adminController = {
  addTeam: async (req, res) => {
    try {
      let checkValid = await Team.findOne({ name: req.body.name });
      if (checkValid) return res.status(400).send("Name already registered.");
      const saveValue = await adminServices.addTeam(req)
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllTeam: async (req, res) => {
    try {
      const teams = await adminServices.getAllTeam();
      res.status(200).json(teams)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getTeamById: async (req, res) => {
    try {
      const result = await adminServices.getTeamById(req.params.id);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateTeamById: async (req, res) => {
    try {
      await adminServices.updateTeamById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)
    }
  },

  searchTeam: async (req, res) => {
    try {
      const result = await adminServices.searchTeam(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)
    }
  },

  deleteTeamById: async (req, res) => {
    try {
      await adminServices.deleteTeamById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)
    }
  },
  /// Office
  addOffice: async (req, res) => {
    try {

      let checkValid = await Office.findOne({ name: req.body.name });
      if (checkValid) return res.status(400).send("Name already registered.");
      const saveValue = await adminServices.addOffice(req)
      res.status(200).json(saveValue.id)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllOffice: async (req, res) => {
    try {
      const data = await adminServices.getAllOffice();
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  searchOffice: async (req, res) => {
    try {
      const result = await adminServices.searchOffice(req)
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getOfficeById: async (req, res) => {
    try {
      const result = await adminServices.getOfficeById(req);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)
    }
  },

  updateOfficeById: async (req, res) => {
    try {
      await adminServices.updateOfficeById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)
    }
  },

  deleteOfficeById: async (req, res) => {
    try {
      await adminServices.deleteOfficeById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  /// Department
  addDepartment: async (req, res) => {
    try {
      let checkValid = await Department.findOne({ name: req.body.name });
      if (checkValid) return res.status(400).send("Name already registered.");

      const saveValue = await adminServices.addDepartment(req);
      res.status(200).json(saveValue)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  searchDepartment: async (req, res) => {
    try {
      const result = await adminServices.searchDepartment(req);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  getAllDepartment: async (req, res) => {
    try {
      const data = await adminServices.getAllDepartment(req)
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const result = await adminServices.getDepartmentById(req);
      res.status(200).json(result)
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  updateDepartmentById: async (req, res) => {
    try {
      await adminServices.updateDepartmentById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  },

  deleteDepartmentById: async (req, res) => {
    try {
      await adminServices.deleteDepartmentById(req)
      res.status(200).json("Success")
    }
    catch (error) {
      res.status(500).json(error)

    }
  }
}

module.exports = adminController;
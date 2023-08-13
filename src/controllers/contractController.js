const { Contract } = require("../models/otherModels")


const contractController = {
  addContract: async (req, res) => {
    try {
      const newContract = new Contract(req.body);
      const savedContract = await newContract.save();
      res.status(200).json(savedContract)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllEmployee: async (req, res) => {
    try {
      const contracts = await Contract.find();
      res.status(200).json(contracts)
    } catch (error) {
      res.status(500).json(error)
    }
  },
}

module.exports = contractController;
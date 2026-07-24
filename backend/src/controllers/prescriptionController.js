const prescriptionModel = require('../models/prescriptionModel');

const getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await prescriptionModel.getPrescriptions();
    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

const createPrescription = async (req, res, next) => {
  try {
    const id = await prescriptionModel.createPrescription(req.body);
    res.status(201).json({ message: 'Prescription created successfully', prescriptionId: id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPrescriptions, createPrescription };

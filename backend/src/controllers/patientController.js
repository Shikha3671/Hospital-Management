const patientModel = require('../models/patientModel');

const getPatients = async (req, res, next) => {
  try {
    const patients = await patientModel.getAllPatients();
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

const getPatient = async (req, res, next) => {
  try {
    const patient = await patientModel.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const createPatient = async (req, res, next) => {
  try {
    const id = await patientModel.createPatient(req.body);
    res.status(201).json({ message: 'Patient created successfully', patientId: id });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    await patientModel.updatePatient(req.params.id, req.body);
    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    await patientModel.deletePatient(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPatients, getPatient, createPatient, updatePatient, deletePatient };

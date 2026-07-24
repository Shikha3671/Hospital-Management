const doctorModel = require('../models/doctorModel');

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await doctorModel.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const getDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorModel.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const id = await doctorModel.createDoctor(req.body);
    res.status(201).json({ message: 'Doctor created successfully', doctorId: id });
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    await doctorModel.updateDoctor(req.params.id, req.body);
    res.json({ message: 'Doctor updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    await doctorModel.deleteDoctor(req.params.id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor };

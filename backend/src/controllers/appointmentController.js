const appointmentModel = require('../models/appointmentModel');

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentModel.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const id = await appointmentModel.createAppointment(req.body);
    res.status(201).json({ message: 'Appointment created successfully', appointmentId: id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAppointments, createAppointment };

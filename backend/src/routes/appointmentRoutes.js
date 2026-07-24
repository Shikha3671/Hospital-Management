const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, appointmentController.getAppointments);
router.post('/', authenticateToken, appointmentController.createAppointment);

module.exports = router;

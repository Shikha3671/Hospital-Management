const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, prescriptionController.getPrescriptions);
router.post('/', authenticateToken, prescriptionController.createPrescription);

module.exports = router;

const express = require('express');
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, patientController.getPatients);
router.get('/:id', authenticateToken, patientController.getPatient);
router.post('/', authenticateToken, patientController.createPatient);
router.put('/:id', authenticateToken, patientController.updatePatient);
router.delete('/:id', authenticateToken, patientController.deletePatient);

module.exports = router;

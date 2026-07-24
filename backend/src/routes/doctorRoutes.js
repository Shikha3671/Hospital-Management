const express = require('express');
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, doctorController.getDoctors);
router.get('/:id', authenticateToken, doctorController.getDoctor);
router.post('/', authenticateToken, doctorController.createDoctor);
router.put('/:id', authenticateToken, doctorController.updateDoctor);
router.delete('/:id', authenticateToken, doctorController.deleteDoctor);

module.exports = router;

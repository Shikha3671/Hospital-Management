const pool = require('../config/db');

const getPrescriptions = async () => {
  const [rows] = await pool.execute(`
    SELECT p.prescription_id, p.medication_name, p.dosage, p.frequency, p.duration_days, p.instructions,
           p.prescribed_at, pt.first_name, pt.last_name
    FROM Prescriptions p
    JOIN Patients pt ON p.patient_id = pt.patient_id
    ORDER BY p.prescribed_at DESC
  `);
  return rows;
};

const createPrescription = async ({ appointmentId, doctorId, patientId, medicationName, dosage, frequency, durationDays, instructions }) => {
  const [result] = await pool.execute(
    `INSERT INTO Prescriptions (appointment_id, doctor_id, patient_id, medication_name, dosage, frequency, duration_days, instructions)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [appointmentId, doctorId, patientId, medicationName, dosage, frequency, durationDays, instructions]
  );
  return result.insertId;
};

module.exports = { getPrescriptions, createPrescription };

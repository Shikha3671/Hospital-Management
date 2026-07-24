const pool = require('../config/db');

const getAllAppointments = async () => {
  const [rows] = await pool.execute(`
    SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.status, a.notes,
           p.first_name AS patient_first_name, p.last_name AS patient_last_name,
           d.first_name AS doctor_first_name, d.last_name AS doctor_last_name,
           dep.department_name
    FROM Appointments a
    JOIN Patients p ON a.patient_id = p.patient_id
    JOIN Doctors d ON a.doctor_id = d.doctor_id
    JOIN Departments dep ON a.department_id = dep.department_id
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `);
  return rows;
};

const createAppointment = async ({ patientId, doctorId, departmentId, appointmentDate, appointmentTime, status, notes }) => {
  const [result] = await pool.execute(
    `INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patientId, doctorId, departmentId, appointmentDate, appointmentTime, status, notes]
  );
  return result.insertId;
};

module.exports = { getAllAppointments, createAppointment };

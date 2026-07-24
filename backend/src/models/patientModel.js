const pool = require('../config/db');

const getAllPatients = async () => {
  const [rows] = await pool.execute('SELECT * FROM Patients ORDER BY patient_id DESC');
  return rows;
};

const getPatientById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM Patients WHERE patient_id = ?', [id]);
  return rows[0];
};

const createPatient = async ({ firstName, lastName, email, phone, dateOfBirth, gender, address, emergencyContact, status }) => {
  const [result] = await pool.execute(
    `INSERT INTO Patients (first_name, last_name, email, phone, date_of_birth, gender, address, emergency_contact, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, phone, dateOfBirth, gender, address, emergencyContact, status]
  );
  return result.insertId;
};

const updatePatient = async (id, data) => {
  const fields = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  values.push(id);
  await pool.execute(`UPDATE Patients SET ${fields.join(', ')} WHERE patient_id = ?`, values);
};

const deletePatient = async (id) => {
  await pool.execute('DELETE FROM Patients WHERE patient_id = ?', [id]);
};

module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient };

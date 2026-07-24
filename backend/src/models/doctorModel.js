const pool = require('../config/db');

const getAllDoctors = async () => {
  const [rows] = await pool.execute(`
    SELECT d.doctor_id, d.first_name, d.last_name, d.email, d.phone, d.specialty, d.status,
           dep.department_name
    FROM Doctors d
    JOIN Departments dep ON d.department_id = dep.department_id
    ORDER BY d.doctor_id DESC
  `);
  return rows;
};

const getDoctorById = async (id) => {
  const [rows] = await pool.execute(`
    SELECT d.doctor_id, d.first_name, d.last_name, d.email, d.phone, d.specialty, d.status,
           dep.department_name
    FROM Doctors d
    JOIN Departments dep ON d.department_id = dep.department_id
    WHERE d.doctor_id = ?
  `, [id]);
  return rows[0];
};

const createDoctor = async ({ firstName, lastName, email, phone, specialty, departmentId, licenseNumber, experienceYears, status }) => {
  const [result] = await pool.execute(
    `INSERT INTO Doctors (first_name, last_name, email, phone, specialty, department_id, license_number, experience_years, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, phone, specialty, departmentId, licenseNumber, experienceYears, status]
  );
  return result.insertId;
};

const updateDoctor = async (id, data) => {
  const fields = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  values.push(id);
  await pool.execute(`UPDATE Doctors SET ${fields.join(', ')} WHERE doctor_id = ?`, values);
};

const deleteDoctor = async (id) => {
  await pool.execute('DELETE FROM Doctors WHERE doctor_id = ?', [id]);
};

module.exports = { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };

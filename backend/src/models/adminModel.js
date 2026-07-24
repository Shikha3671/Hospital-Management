const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerAdmin = async ({ fullName, email, password, phone }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO Admin (full_name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
    [fullName, email, hashedPassword, phone]
  );
  return result.insertId;
};

const loginAdmin = async ({ email, password }) => {
  const [rows] = await pool.execute('SELECT * FROM Admin WHERE email = ?', [email]);

  if (rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const admin = rows[0];
  const isMatch = await bcrypt.compare(password, admin.password_hash);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: admin.admin_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  return {
    token,
    admin: {
      id: admin.admin_id,
      fullName: admin.full_name,
      email: admin.email,
      phone: admin.phone,
      status: admin.status
    }
  };
};

module.exports = { registerAdmin, loginAdmin };

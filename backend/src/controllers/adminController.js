const { registerAdmin, loginAdmin } = require('../models/adminModel');

const register = async (req, res, next) => {
  try {
    const id = await registerAdmin(req.body);
    res.status(201).json({ message: 'Admin registered successfully', adminId: id });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginAdmin(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password, mobileNumber, role, govtId } = req.body;
  try {
    if (role === 'admin') {
      return res.status(400).json({ msg: 'Cannot register as an Admin.' });
    }
    let user = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (user) {
      return res.status(400).json({ msg: 'User with this email or mobile number already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword, mobileNumber, role, govtId });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Hidden Admin Login from Seller page
    if (role === 'seller' && email === 'admin@jharkhand.gov.in' && password === 'admin') {
      const payload = { user: { id: 'admin_user_001', role: 'admin' } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { name: 'Platform Admin', email: 'admin@jharkhand.gov.in', role: 'admin' } });
    }
    
    const user = await User.findOne({ email });
    if (!user || user.role !== role) {
      return res.status(400).json({ msg: 'Invalid credentials or role mismatch' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { _id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;


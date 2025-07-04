const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/authMiddleware');


router.post('/register', async (req, res) => {
  const { name, email, password, role, department, location } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashed,
    role,
    department,
    location
  });

  await user.save();
  res.status(201).json({ msg: 'User created' });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role, name: user.name, department: user.department, location:user.location }, process.env.JWT_SECRET);
  res.json({ token, role: user.role, name: user.name, department: user.department, location: user.location, role:user.role});
});

router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  const users = await User.find({}, 'name email role department');
  res.json(users);
});


router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});


module.exports = router;

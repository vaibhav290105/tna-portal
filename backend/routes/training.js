const express = require('express');
const router = express.Router();
const TrainingNeed = require('../models/TrainingNeed');
const auth = require('../middleware/authMiddleware');

// Submit training request (Employee)
router.post('/submit', auth, async (req, res) => {
  
  try {
    console.log('Authenticated User:', req.user);

    const trainingNeed = new TrainingNeed({
      user: req.user._id,
      department: req.user.department,
      ...req.body, // Automatically maps all the structured form fields
      status: 'Pending',
    });

    await trainingNeed.save();
    res.json({ msg: 'Training request submitted successfully' });
  } catch (err) {
    console.error('Training Request Submission Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all training requests (Admin/Manager)
router.get('/all', auth, async (req, res) => {
  if (req.user.role === 'employee') return res.status(403).json({ msg: 'Forbidden' });

  try {
    const requests = await TrainingNeed.find()
      .populate('user', 'name email department')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Fetching Training Requests Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

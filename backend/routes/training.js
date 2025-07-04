const express = require('express');
const router = express.Router();
const TrainingNeed = require('../models/TrainingNeed');
const auth = require('../middleware/authMiddleware');

// Submit training request (Employee)
router.post('/submit', auth, async (req, res) => {
  
  try {
    const status = req.user.role === 'manager' ? 'Approved_By_Manager' : 'Pending_Manager';


    const trainingNeed = new TrainingNeed({
      user: req.user._id,
      department: req.user.department,
      ...req.body, 
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

router.put('/update-status/:id', auth, async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['Pending', 'Approved', 'Rejected'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }

  try {
    const updated = await TrainingNeed.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await TrainingNeed.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Fetching My Training Requests Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get all requests needing manager review
router.get('/manager-review', auth, async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).send('Forbidden');

  const requests = await TrainingNeed.find({
    status: 'Pending_Manager',
    department: req.user.department
  }).populate('user', 'name department');

  res.json(requests);
});

// Approve or Reject
router.patch('/manager-review/:id', auth, async (req, res) => {
  const { decision } = req.body; // decision = 'approve' or 'reject'
  if (req.user.role !== 'manager') return res.status(403).send('Forbidden');

  const status = decision === 'approve' ? 'Approved_By_Manager' : 'Rejected_By_Manager';

  await TrainingNeed.findByIdAndUpdate(req.params.id, {
    status,
    reviewedByManager: req.user._id
  });

  res.json({ msg: `Training request ${status}` });
});



// Get requests that manager already approved
router.get('/admin-review', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');

  const requests = await TrainingNeed.find({
    status: 'Approved_By_Manager'
  }).populate('user', 'name department');

  res.json(requests);
});

// Admin approves or rejects
router.patch('/admin-review/:id', auth, async (req, res) => {
  const { decision } = req.body;
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');

  const status = decision === 'approve' ? 'Approved_By_Admin' : 'Rejected_By_Admin';

  await TrainingNeed.findByIdAndUpdate(req.params.id, {
    status,
    reviewedByAdmin: req.user._id
  });

  res.json({ msg: `Training request ${status}` });
});


module.exports = router;

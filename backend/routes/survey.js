const express = require('express');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();


router.post('/create', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  const { title, questions, assignedTo } = req.body;
  const survey = new Survey({ title, questions, assignedTo });
  await survey.save();
  res.json(survey);
});


router.get('/assigned', auth, async (req, res) => {
  const surveys = await Survey.find({ assignedTo: req.user.id });
  res.json(surveys);
});

router.get('/assigned-with-status', auth, async (req, res) => {
  const userId = req.user.id;

  const assignedSurveys = await Survey.find({ assignedTo: userId });
  const responses = await Response.find({ userId });

  const submittedSurveyIds = responses.map((r) => r.surveyId.toString());

  const surveysWithStatus = assignedSurveys.map((survey) => ({
    _id: survey._id,
    title: survey.title,
    status: submittedSurveyIds.includes(survey._id.toString()) ? 'Completed' : 'Pending'
  }));

  res.json(surveysWithStatus);
});

router.get('/:id/responses', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  
  const survey = await Survey.findById(req.params.id).lean();
  const responses = await Response.find({ surveyId: req.params.id })
    .populate('userId', 'name email department');

  res.json({ questions: survey.questions, responses });
});


router.get('/created', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden - admin only' });
    }

    const surveys = await Survey.find({}, 'title _id assignedTo').populate('assignedTo', 'name email').lean();
    
    const enrichedSurveys = await Promise.all(
      surveys.map(async (s) => {
        const responseCount = await Response.countDocuments({surveyId: s._id});
        return { ...s, responseCount};
      })
    )
    res.json(enrichedSurveys);
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

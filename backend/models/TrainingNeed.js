const mongoose = require('mongoose');

const TrainingNeedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: String,
 
  
  // General Training Needs
  generalSkills: String,
  toolsTraining: String,
  softSkills: String,

  // Technical Skill Assessment
  confidenceLevel: String,
  technicalSkills: String,
  dataTraining: String,

  // Role-Specific Development
  roleChallenges: String,
  efficiencyTraining: String,
  certifications: String,

  // Career Progression & Aspirations
  careerGoals: String,
  careerTraining: String,

  // Training Format Preferences
  trainingFormat: String,
  trainingDuration: String,
  learningPreference: String,

  // Feedback on Past Trainings
  pastTraining: String,
  pastTrainingFeedback: String,
  trainingImprovement: String,

  // Multiple Choice
  areaNeed: String,
  trainingFrequency: String,

  status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('TrainingNeed', TrainingNeedSchema);

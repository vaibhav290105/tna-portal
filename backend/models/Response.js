const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [String]
});

module.exports = mongoose.model('Response', ResponseSchema);

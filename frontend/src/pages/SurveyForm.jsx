import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const SurveyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await API.get('/survey/assigned');
        const found = res.data.find((s) => s._id === id);
        if (found) {
          setSurvey(found);
          setAnswers(new Array(found.questions.length).fill(''));
        } else {
          alert('Survey not found or not assigned to you.');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id, navigate]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  const handleChange = useCallback((index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  }, [answers]);

  const handleSubmit = async () => {
    if (answers.some(answer => !answer.trim())) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/response/submit', { surveyId: id, answers });
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.msg || 'Already submitted');
      } else {
        alert('Failed to submit response');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = survey ? ((currentQuestion + 1) / survey.questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!survey) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your response has been submitted successfully.</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">{survey.title}</h2>
            <div className="flex items-center justify-between text-blue-100">
              <span>Question {currentQuestion + 1} of {survey.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2 mt-3">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                {survey.questions[currentQuestion]}
              </label>
              <textarea
                value={answers[currentQuestion]}
                onChange={(e) => handleChange(currentQuestion, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-32 resize-none"
                placeholder="Type your answer here..."
                required
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {survey.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentQuestion
                        ? 'bg-blue-600'
                        : answers[index]
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentQuestion === survey.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answers.some(answer => !answer.trim())}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Progress Overview</h3>
          <div className="grid grid-cols-4 gap-2">
            {survey.questions.map((_, index) => (
              <div
                key={index}
                className={`p-2 rounded text-center text-sm ${
                  answers[index]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                Q{index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
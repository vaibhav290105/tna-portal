import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const TrainingForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    generalSkills: '',
    toolsTraining: '',
    softSkills: '',
    confidenceLevel: '',
    technicalSkills: '',
    dataTraining: '',
    roleChallenges: '',
    efficiencyTraining: '',
    certifications: '',
    careerGoals: '',
    careerTraining: '',
    trainingFormat: '',
    trainingDuration: '',
    learningPreference: '',
    pastTraining: '',
    pastTrainingFeedback: '',
    trainingImprovement: '',
    areaNeed: '',
    trainingFrequency: '',
  });

  const formSteps = [
    {
      title: 'Skills Assessment',
      icon: '🎯',
      fields: ['generalSkills', 'toolsTraining', 'softSkills', 'confidenceLevel']
    },
    {
      title: 'Technical & Role Focus',
      icon: '💻',
      fields: ['technicalSkills', 'dataTraining', 'roleChallenges', 'efficiencyTraining']
    },
    {
      title: 'Career Development',
      icon: '🚀',
      fields: ['certifications', 'careerGoals', 'careerTraining']
    },
    {
      title: 'Training Preferences',
      icon: '📚',
      fields: ['trainingFormat', 'trainingDuration', 'learningPreference']
    },
    {
      title: 'Experience & Feedback',
      icon: '💭',
      fields: ['pastTraining', 'pastTrainingFeedback', 'trainingImprovement', 'areaNeed', 'trainingFrequency']
    }
  ];

  const fieldConfig = {
    generalSkills: { label: 'What skills do you feel you need to improve?', type: 'textarea' },
    toolsTraining: { label: "Tools or software you'd like to get trained on?", type: 'text' },
    softSkills: { label: 'Need training in communication, leadership, or soft skills?', type: 'text' },
    confidenceLevel: { label: 'Confidence level with tools (Excel, SAP, etc.)?', type: 'select', options: ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    technicalSkills: { label: "Technical skills you'd like to learn?", type: 'text' },
    dataTraining: { label: 'Need training in data analysis or reporting?', type: 'text' },
    roleChallenges: { label: 'Challenges in your current role?', type: 'textarea' },
    efficiencyTraining: { label: 'Training to perform your job better?', type: 'text' },
    certifications: { label: "Certifications you're interested in?", type: 'text' },
    careerGoals: { label: 'Where do you see yourself in 2 years?', type: 'textarea' },
    careerTraining: { label: 'Training needed to reach your goals?', type: 'text' },
    trainingFormat: { label: 'Preferred training format?', type: 'select', options: ['', 'In-person', 'Online Live', 'Self-paced'] },
    trainingDuration: { label: 'Preferred duration?', type: 'select', options: ['', '1 Day', '1 Week', 'Short Sessions'] },
    learningPreference: { label: 'Learning preference?', type: 'select', options: ['', 'Individual', 'Team-based'] },
    pastTraining: { label: 'Attended any training in the last 6 months?', type: 'text' },
    pastTrainingFeedback: { label: 'Was it relevant and helpful?', type: 'text' },
    trainingImprovement: { label: 'Suggestions for improvement?', type: 'textarea' },
    areaNeed: { label: 'Area you need most training in:', type: 'select', options: ['', 'Technical Skills', 'Communication', 'Leadership', 'Time Management', 'Other'] },
    trainingFrequency: { label: 'Training frequency preferred:', type: 'select', options: ['', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually'] }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await API.post('/training-request/submit', formData);
      alert('✅ Training request submitted successfully!');
      if (role === 'manager') navigate('/manager');
      else navigate('/dashboard');
    } catch (err) {
      alert('❌ Error submitting training request.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = useCallback(() => {
    if (role === 'manager') navigate('/manager');
    else navigate('/dashboard');
  }, [role, navigate]);

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (stepIndex) => {
    const step = formSteps[stepIndex];
    return step.fields.every(field => formData[field] && formData[field].trim() !== '');
  };

  const currentStepData = formSteps[currentStep];
  const progress = ((currentStep + 1) / formSteps.length) * 100;

  const renderField = (fieldName) => {
    const config = fieldConfig[fieldName];
    const value = formData[fieldName];

    const baseClasses = "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

    if (config.type === 'textarea') {
      return (
        <textarea
          name={fieldName}
          value={value}
          onChange={handleChange}
          className={`${baseClasses} min-h-24 resize-none`}
          placeholder="Enter your response..."
        />
      );
    }

    if (config.type === 'select') {
      return (
        <select
          name={fieldName}
          value={value}
          onChange={handleChange}
          className={`${baseClasses} bg-white`}
        >
          {config.options.map((option, i) => (
            <option key={i} value={option}>
              {option || 'Select an option'}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        name={fieldName}
        value={value}
        onChange={handleChange}
        className={baseClasses}
        placeholder="Enter your response..."
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📋</span>
                <h1 className="text-2xl font-bold">Training Request Form</h1>
              </div>
              <button
                onClick={handleBack}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-blue-100 text-sm mb-2">
                <span>Step {currentStep + 1} of {formSteps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex justify-between">
              {formSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 ${
                    index === currentStep ? 'text-white' : 'text-blue-200'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                    index === currentStep 
                      ? 'bg-white text-blue-600' 
                      : isStepComplete(index)
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-400 text-white'
                  }`}>
                    {isStepComplete(index) ? '✓' : step.icon}
                  </div>
                  <span className="text-xs text-center hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                <span>{currentStepData.icon}</span>
                <span>{currentStepData.title}</span>
              </h2>
              <p className="text-gray-600">Please provide detailed information for better training recommendations.</p>
            </div>

            <div className="space-y-6">
              {currentStepData.fields.map((fieldName) => (
                <div key={fieldName} className="space-y-2">
                  <label className="block font-semibold text-gray-700">
                    {fieldConfig[fieldName].label}
                  </label>
                  {renderField(fieldName)}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {formSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-blue-600'
                        : isStepComplete(index)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep === formSteps.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
            <span>💡</span>
            <span>Tips for Better Results</span>
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Be specific about your training needs and goals</li>
            <li>• Mention any time constraints or preferences</li>
            <li>• Include relevant experience or background information</li>
            <li>• Think about how training will impact your current role</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingForm;
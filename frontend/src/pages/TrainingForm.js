import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function TrainingRequestForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
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

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/training-request/submit', formData);
      alert('✅ Training request submitted successfully!');
      if (role === 'manager') navigate('/manager');
      else navigate('/dashboard');
    } catch (err) {
      alert('❌ Error submitting training request.');
      console.error(err);
    }
  };

  const handleBack = () => {
    if (role === 'manager') navigate('/manager');
    else navigate('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📋 Training Request Form</h2>
        <button
          onClick={handleBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {[
          { label: 'What skills do you feel you need to improve?', name: 'generalSkills', type: 'textarea' },
          { label: "Tools or software you'd like to get trained on?", name: 'toolsTraining' },
          { label: 'Need training in communication, leadership, or soft skills?', name: 'softSkills' },
          { label: 'Confidence level with tools (Excel, SAP, etc.)?', name: 'confidenceLevel' },
          { label: "Technical skills you'd like to learn?", name: 'technicalSkills' },
          { label: 'Need training in data analysis or reporting?', name: 'dataTraining' },
          { label: 'Challenges in your current role?', name: 'roleChallenges', type: 'textarea' },
          { label: 'Training to perform your job better?', name: 'efficiencyTraining' },
          { label: "Certifications you're interested in?", name: 'certifications' },
          { label: 'Where do you see yourself in 2 years?', name: 'careerGoals', type: 'textarea' },
          { label: 'Training needed to reach your goals?', name: 'careerTraining' },
          {
            label: 'Preferred training format?',
            name: 'trainingFormat',
            type: 'select',
            options: ['', 'In-person', 'Online Live', 'Self-paced'],
          },
          {
            label: 'Preferred duration?',
            name: 'trainingDuration',
            type: 'select',
            options: ['', '1 Day', '1 Week', 'Short Sessions'],
          },
          {
            label: 'Learning preference?',
            name: 'learningPreference',
            type: 'select',
            options: ['', 'Individual', 'Team-based'],
          },
          {
            label: 'Attended any training in the last 6 months?',
            name: 'pastTraining',
          },
          {
            label: 'Was it relevant and helpful?',
            name: 'pastTrainingFeedback',
          },
          {
            label: 'Suggestions for improvement?',
            name: 'trainingImprovement',
            type: 'textarea',
          },
          {
            label: 'Area you need most training in:',
            name: 'areaNeed',
            type: 'select',
            options: ['', 'Technical Skills', 'Communication', 'Leadership', 'Time Management', 'Other'],
          },
          {
            label: 'Training frequency preferred:',
            name: 'trainingFrequency',
            type: 'select',
            options: ['', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
          },
        ].map((field, index) => (
          <div key={index} className="col-span-1">
            <label className="block font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {field.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt || 'Select'}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
        ))}

        <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded shadow"
          >
            🚀 Submit Training Request
          </button>
        </div>
      </form>
    </div>
  );
}

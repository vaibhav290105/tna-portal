import React, { useState } from 'react';
import API from '../services/api';

export default function TrainingRequestForm() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/training-request/submit', formData);
      alert('Training request submitted successfully!');
    } catch (err) {
      alert('Error submitting training request.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-semibold">Training Request Form</h2>

      <div>
        <label>What skills do you feel you need to improve?</label>
        <textarea name="generalSkills" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Tools or software you'd like to get trained on?</label>
        <input name="toolsTraining" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Need training in communication, leadership, or soft skills?</label>
        <input name="softSkills" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Confidence level with tools (Excel, SAP, etc.)?</label>
        <input name="confidenceLevel" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Technical skills you'd like to learn?</label>
        <input name="technicalSkills" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Need training in data analysis or reporting?</label>
        <input name="dataTraining" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Challenges in your current role?</label>
        <textarea name="roleChallenges" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Training to perform your job better?</label>
        <input name="efficiencyTraining" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Certifications you're interested in?</label>
        <input name="certifications" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Where do you see yourself in 2 years?</label>
        <textarea name="careerGoals" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Training needed to reach your goals?</label>
        <input name="careerTraining" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Preferred training format?</label>
        <select name="trainingFormat" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select</option>
          <option>In-person</option>
          <option>Online Live</option>
          <option>Self-paced</option>
        </select>
      </div>

      <div>
        <label>Preferred duration?</label>
        <select name="trainingDuration" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select</option>
          <option>1 Day</option>
          <option>1 Week</option>
          <option>Short Sessions</option>
        </select>
      </div>

      <div>
        <label>Learning preference?</label>
        <select name="learningPreference" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select</option>
          <option>Individual</option>
          <option>Team-based</option>
        </select>
      </div>

      <div>
        <label>Attended any training in the last 6 months?</label>
        <input name="pastTraining" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Was it relevant and helpful?</label>
        <input name="pastTrainingFeedback" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Suggestions for improvement?</label>
        <textarea name="trainingImprovement" onChange={handleChange} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label>Area you need most training in:</label>
        <select name="areaNeed" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select</option>
          <option>Technical Skills</option>
          <option>Communication</option>
          <option>Leadership</option>
          <option>Time Management</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label>Training frequency preferred:</label>
        <select name="trainingFrequency" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select</option>
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Bi-annually</option>
          <option>Annually</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}

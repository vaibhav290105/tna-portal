import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('survey');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [success, setSuccess] = useState('');
  const [trainingRequests, setTrainingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Load users for survey assignment
  useEffect(() => {
    if (activeTab === 'survey') {
      API.get('/auth/users')
        .then((res) => {
          const nonAdmins = res.data.filter((user) => user.role !== 'admin');
          setUsers(nonAdmins);
        })
        .catch(() => alert('Failed to fetch users'));
    }
  }, [activeTab]);

  // Load surveys
  useEffect(() => {
    if (activeTab === 'survey') {
      API.get('/survey/created')
        .then((res) => setSurveys(res.data))
        .catch(() => console.error('Failed to load created surveys'));
    }
  }, [success, activeTab]);

  // Load training requests
  useEffect(() => {
    if (activeTab === 'training') {
      API.get('/training-request/all')
        .then((res) => setTrainingRequests(res.data))
        .catch(() => alert('Failed to fetch training requests'));
    }
  }, [activeTab]);
  

  const addQuestion = () => setQuestions([...questions, '']);
  const updateQuestion = (index, value) => {
    const copy = [...questions];
    copy[index] = value;
    setQuestions(copy);
  };

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const createSurvey = async () => {
    if (!title || questions.some((q) => !q)) return alert('Fill all fields');
    try {
      await API.post('/survey/create', {
        title,
        questions,
        assignedTo: selectedUsers,
      });
      setTitle('');
      setQuestions(['']);
      setSelectedUsers([]);
      setSuccess('Survey created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Survey creation failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel</h2>

      {/* Tab Buttons */}
      <div className="flex justify-center mb-8 gap-6">
        <button
          onClick={() => setActiveTab('survey')}
          className={`px-5 py-2 rounded text-white ${
            activeTab === 'survey' ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        >
          📋 Manage Surveys
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-5 py-2 rounded text-white ${
            activeTab === 'training' ? 'bg-green-600' : 'bg-gray-400'
          }`}
        >
          📝 View Training Requests
        </button>
      </div>

      {/* Survey Section */}
      {activeTab === 'survey' && (
        <>
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
              {success}
            </div>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Survey Title"
            className="w-full border p-2 mb-4 rounded"
          />
          {questions.map((q, i) => (
            <input
              key={i}
              value={q}
              onChange={(e) => updateQuestion(i, e.target.value)}
              placeholder={`Question ${i + 1}`}
              className="w-full border p-2 mb-2 rounded"
            />
          ))}
          <button onClick={addQuestion} className="bg-gray-200 px-3 py-1 rounded mr-3">
            + Add Question
          </button>

          <h3 className="text-lg mt-6 mb-2 font-semibold">Assign to Users:</h3>
          <div className="max-h-40 overflow-y-auto border p-2 mb-6 rounded">
            {users.map((user) => (
              <label key={user._id} className="block mb-1">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                  className="mr-2"
                />
                {user.name} ({user.role})
              </label>
            ))}
          </div>

          <button
            onClick={createSurvey}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            Create Survey
          </button>

          <hr className="my-8" />
          <h2 className="text-2xl font-semibold mb-4">Created Surveys</h2>
          <ul className="space-y-3">
            {surveys.map((survey) => (
              <li
                key={survey._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <div className="text-lg font-medium text-gray-800">{survey.title}</div>
                  <div className="text-sm text-gray-600">
                    Assigned: {survey.assignedTo?.length || 0} | Responses: {survey.responseCount || 0}
                  </div>
                </div>
                <Link
                  to={`/survey/${survey._id}/responses`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Responses
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Training Requests Section */}
      {activeTab === 'training' && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Employee Training Requests</h2>
          {trainingRequests.length === 0 ? (
            <p className="text-gray-500">No training requests submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">Employee</th>
                    <th className="px-4 py-2 border">Department</th>
                    <th className="px-4 py-2 border">Career Goals</th>
                    <th className="px-4 py-2 border">Skills Needed</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingRequests.map((req) => (
                    <tr key={req._id}>
                      <td className="px-4 py-2 border">{req.user?.name}</td>
                      <td className="px-4 py-2 border">{req.user?.department}</td>
                      <td className="px-4 py-2 border">{req.careerGoals}</td>
                      <td className="px-4 py-2 border">{req.generalSkills}</td>
                      <td className="px-4 py-2 border">{req.status}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal for Training Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4">Training Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Employee:</strong> {selectedRequest.user?.name}</p>
              <p><strong>Department:</strong> {selectedRequest.user?.department}</p>
              <p><strong>Location:</strong> {selectedRequest.user?.location}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>General Skills:</strong> {selectedRequest.generalSkills}</p>
              <p><strong>Tools Training:</strong> {selectedRequest.toolsTraining}</p>
              <p><strong>Soft Skills:</strong> {selectedRequest.softSkills}</p>
              <p><strong>Technical Skills:</strong> {selectedRequest.technicalSkills}</p>
              <p><strong>Data Training:</strong> {selectedRequest.dataTraining}</p>
              <p><strong>Role Challenges:</strong> {selectedRequest.roleChallenges}</p>
              <p><strong>Efficiency Training:</strong> {selectedRequest.efficiencyTraining}</p>
              <p><strong>Certifications:</strong> {selectedRequest.certifications}</p>
              <p><strong>Career Goals:</strong> {selectedRequest.careerGoals}</p>
              <p><strong>Training Format:</strong> {selectedRequest.trainingFormat}</p>
              <p><strong>Duration:</strong> {selectedRequest.trainingDuration}</p>
              <p><strong>Learning Preference:</strong> {selectedRequest.learningPreference}</p>
              <p><strong>Past Training:</strong> {selectedRequest.pastTraining}</p>
              <p><strong>Feedback:</strong> {selectedRequest.pastTrainingFeedback}</p>
              <p><strong>Improvement:</strong> {selectedRequest.trainingImprovement}</p>
              <p><strong>Area Needed:</strong> {selectedRequest.areaNeed}</p>
              <p><strong>Frequency:</strong> {selectedRequest.trainingFrequency}</p>
            </div>
            <div className="text-right mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

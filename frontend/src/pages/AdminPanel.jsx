import React, { useEffect, useState, useCallback, useMemo } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('survey');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [success, setSuccess] = useState('');
  const [trainingRequests, setTrainingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get('/auth/users');
      const nonAdmins = res.data.filter((user) => user.role !== 'admin');
      setUsers(nonAdmins);
    } catch {
      alert('Failed to fetch users');
    }
  }, []);

  const fetchSurveys = useCallback(async () => {
    try {
      const res = await API.get('/survey/created');
      setSurveys(res.data);
    } catch {
      console.error('Failed to load created surveys');
    }
  }, []);

  const fetchTrainingRequests = useCallback(async () => {
    try {
      const res = await API.get('/training-request/all');
      setTrainingRequests(res.data);
    } catch {
      alert('Failed to fetch training requests');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'survey') {
      fetchUsers();
      fetchSurveys();
    } else if (activeTab === 'training') {
      fetchTrainingRequests();
    }
  }, [activeTab, success, fetchUsers, fetchSurveys, fetchTrainingRequests]);

  const addQuestion = useCallback(() => {
    setQuestions(prev => [...prev, '']);
  }, []);

  const updateQuestion = useCallback((index, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }, []);

  const removeQuestion = useCallback((index) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter((_, i) => i !== index));
    }
  }, [questions.length]);

  const toggleUser = useCallback((id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  }, []);

  const createSurvey = async () => {
    if (!title || questions.some(q => !q)) {
      alert('Please fill all fields');
      return;
    }
    
    setIsLoading(true);
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
    } catch {
      alert('Survey creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, decision) => {
    try {
      await API.patch(`/training-request/admin-review/${id}`, { decision });
      setTrainingRequests(prev => prev.map(r =>
        r._id === id
          ? {
              ...r,
              status: decision === 'approve' ? 'Approved_By_Admin' : 'Rejected_By_Admin',
            }
          : r
      ));
    } catch {
      alert('Failed to update status');
    }
  };

  const formatStatus = useCallback((status) => {
    const statusMap = {
      'Approved_By_Admin': { label: 'Approved by Admin', color: 'bg-green-100 text-green-700 border-green-200' },
      'Rejected_By_Admin': { label: 'Rejected by Admin', color: 'bg-red-100 text-red-700 border-red-200' },
      'Approved_By_Manager': { label: 'Approved by Manager', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'Rejected_By_Manager': { label: 'Rejected by Manager', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      'Pending_Manager': { label: 'Pending Manager Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    navigate('/');
  }, [navigate]);

  const usersByDepartment = useMemo(() => {
    return users.reduce((acc, user) => {
      const dept = user.department || 'Other';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(user);
      return acc;
    }, {});
  }, [users]);

  const surveyStats = useMemo(() => {
    const totalResponses = surveys.reduce((sum, survey) => sum + (survey.responseCount || 0), 0);
    return {
      totalSurveys: surveys.length,
      totalResponses,
      avgResponsesPerSurvey: surveys.length ? (totalResponses / surveys.length).toFixed(1) : 0
    };
  }, [surveys]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-6">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
              activeTab === 'survey' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' 
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            <span>📋</span>
            <span>Feedback Form Management</span>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
              activeTab === 'training' 
                ? 'bg-gradient-to-r from-green-600 to-teal-600 shadow-lg' 
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            <span>📝</span>
            <span>Training Requests</span>
          </button>
        </div>

        {/* Survey Tab */}
        {activeTab === 'survey' && (
          <div className="space-y-8">
            {/* Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center font-medium animate-pulse">
                ✅ {success}
              </div>
            )}

            {/* Survey Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{surveyStats.totalSurveys}</p>
                    <p className="text-gray-600">Total Surveys</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📝</span>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{surveyStats.totalResponses}</p>
                    <p className="text-gray-600">Total Responses</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📈</span>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{surveyStats.avgResponsesPerSurvey}</p>
                    <p className="text-gray-600">Avg per Survey</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Survey Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span>✨</span>
                <span>Create New Survey</span>
              </h2>

              <div className="space-y-6">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Survey Title"
                  className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                  {questions.map((q, i) => (
                    <div key={i} className="flex space-x-3">
                      <input
                        value={q}
                        onChange={(e) => updateQuestion(i, e.target.value)}
                        placeholder={`Question ${i + 1}`}
                        className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      {questions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(i)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addQuestion}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>➕</span>
                    <span>Add Question</span>
                  </button>
                </div>

                {/* User Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Assign to Users</h3>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
                    {Object.entries(usersByDepartment).map(([department, deptUsers]) => (
                      <div key={department} className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2 bg-white px-3 py-1 rounded">{department}</h4>
                        <div className="space-y-2 ml-4">
                          {deptUsers.map((user) => (
                            <label key={user._id} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => toggleUser(user._id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-gray-700">
                                {user.name} — <span className="text-sm text-gray-500">{user.role}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedUsers.length} user(s)
                  </p>
                </div>

                <button
                  onClick={createSurvey}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      <span>Create Survey</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Created Surveys */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span>📄</span>
                <span>Created Surveys</span>
              </h2>
              {surveys.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No surveys created yet.</p>
              ) : (
                <div className="grid gap-4">
                  {surveys.map((survey) => (
                    <div key={survey._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{survey.title}</h3>
                          <div className="flex space-x-6 text-sm text-gray-600">
                            <span>👥 Assigned: {survey.assignedTo?.length || 0}</span>
                            <span>📝 Responses: {survey.responseCount || 0}</span>
                          </div>
                        </div>
                        <Link
                          to={`/survey/${survey._id}/responses`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        >
                          <span>👁️</span>
                          <span>View Responses</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <span>📋</span>
              <span>Training Requests</span>
            </h2>
            
            {trainingRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">No training requests submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Employee</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Department</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {trainingRequests.map((req) => {
                      const { label, color } = formatStatus(req.status);
                      return (
                        <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-800">{req.user?.name}</td>
                          <td className="px-6 py-4 text-gray-600">{req.user?.department}</td>
                          <td className="px-6 py-4 text-gray-600 capitalize">{req.user?.role}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium border ${color}`}>
                              {label}
                            </span>
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            <button
                              onClick={() => updateStatus(req._id, 'approve')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => updateStatus(req._id, 'reject')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              ✕ Reject
                            </button>
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              👁️ View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <span>📝</span>
                <span>Training Request Details</span>
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {[
                { label: 'Employee', value: selectedRequest.user?.name },
                { label: 'Department', value: selectedRequest.user?.department },
                { label: 'Location', value: selectedRequest.user?.location },
                { label: 'Status', value: formatStatus(selectedRequest.status).label },
                { label: 'General Skills', value: selectedRequest.generalSkills },
                { label: 'Tools Training', value: selectedRequest.toolsTraining },
                { label: 'Soft Skills', value: selectedRequest.softSkills },
                { label: 'Technical Skills', value: selectedRequest.technicalSkills },
                { label: 'Data Training', value: selectedRequest.dataTraining },
                { label: 'Role Challenges', value: selectedRequest.roleChallenges },
                { label: 'Efficiency Training', value: selectedRequest.efficiencyTraining },
                { label: 'Certifications', value: selectedRequest.certifications },
                { label: 'Career Goals', value: selectedRequest.careerGoals },
                { label: 'Training Format', value: selectedRequest.trainingFormat },
                { label: 'Duration', value: selectedRequest.trainingDuration },
                { label: 'Learning Preference', value: selectedRequest.learningPreference },
                { label: 'Past Training', value: selectedRequest.pastTraining },
                { label: 'Feedback', value: selectedRequest.pastTrainingFeedback },
                { label: 'Improvement', value: selectedRequest.trainingImprovement },
                { label: 'Area Needed', value: selectedRequest.areaNeed },
                { label: 'Frequency', value: selectedRequest.trainingFrequency }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">{item.label}:</p>
                  <p className="text-gray-600">{item.value || 'Not specified'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
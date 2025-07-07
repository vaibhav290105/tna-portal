import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ManagerPanel = () => {
  const [tab, setTab] = useState('review');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/');
  }, [navigate]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'review'
        ? '/training-request/manager-review'
        : '/training-request/my-requests';
      const res = await API.get(endpoint);
      setRequests(res.data);
    } catch {
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleDecision = async (id, decision) => {
    try {
      await API.patch(`/training-request/manager-review/${id}`, { decision });
      setRequests(prev => prev.filter(r => r._id !== id));
      setSelectedRequest(null);
    } catch {
      alert('Failed to update request');
    }
  };

  const statusConfig = useMemo(() => ({
    'Approved_By_Admin': { 
      label: 'Approved by Admin', 
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '✅'
    },
    'Rejected_By_Manager': { 
      label: 'Rejected by Manager', 
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: '❌'
    },
    'Rejected_By_Admin': { 
      label: 'Rejected by Admin', 
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: '❌'
    },
    'Pending_Manager': { 
      label: 'Pending Manager Review', 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: '⏳'
    },
    'Approved_By_Manager': { 
      label: 'Approved by Manager', 
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '👍'
    },
    'Pending_Admin': { 
      label: 'Pending Admin Review', 
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: '⏳'
    }
  }), []);

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: '❓'
    };
    
    return (
      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  const requestStats = useMemo(() => {
    if (tab !== 'review') return null;
    
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Pending_Manager').length
    };
  }, [requests, tab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👔</span>
            <h1 className="text-xl font-bold">Manager Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => setTab('review')}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
                tab === 'review' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' 
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              <span>📝</span>
              <span>Review Requests</span>
              {requestStats && requestStats.pending > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {requestStats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/training-request')}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>New Training Request</span>
            </button>
            <button
              onClick={() => setTab('submitted')}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
                tab === 'submitted' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              <span>📤</span>
              <span>My Submitted Requests</span>
            </button>
          </div>
        </div>

        {/* Stats for Review Tab */}
        {tab === 'review' && requestStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📊</span>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{requestStats.total}</p>
                  <p className="text-gray-600">Total Requests</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⏳</span>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{requestStats.pending}</p>
                  <p className="text-gray-600">Pending Review</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading requests...</p>
          </div>
        )}

        {/* Requests List */}
        {!loading && (
          <>
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="text-6xl mb-4">
                  {tab === 'review' ? '📝' : '📤'}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {tab === 'review' ? 'No Requests to Review' : 'No Submitted Requests'}
                </h2>
                <p className="text-gray-600">
                  {tab === 'review' 
                    ? 'All training requests have been reviewed.' 
                    : 'You haven\'t submitted any training requests yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <span>👤</span>
                        <span>{req.user?.name || 'You'}</span>
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center space-x-2">
                          <span>🏢</span>
                          <span>{req.user?.department}</span>
                        </p>
                        <div>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="flex items-center space-x-2">
                          <span>📅</span>
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    {/* Training Areas Preview */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Training Areas:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        {[req.generalSkills, req.technicalSkills, req.softSkills]
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((skill, index) => (
                            <div key={index} className="truncate">
                              • {skill.length > 40 ? `${skill.substring(0, 40)}...` : skill}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {tab === 'review' && req.status === 'Pending_Manager' && (
                        <>
                          <button
                            onClick={() => handleDecision(req._id, 'approve')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <span>✓</span>
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleDecision(req._id, 'reject')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <span>✕</span>
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <span>👁️</span>
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <span>🗂️</span>
                  <span>Training Request Details</span>
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-white hover:text-gray-200 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Employee: {selectedRequest.user?.name || 'You'}</p>
                  <p className="text-blue-100">Department: {selectedRequest.user?.department}</p>
                </div>
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Employee', value: selectedRequest.user?.name || 'You' },
                  { label: 'Department', value: selectedRequest.user?.department },
                  { label: 'Status', value: selectedRequest.status.replace(/_/g, ' ') },
                  { label: 'Location', value: selectedRequest.user?.location },
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
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-700 mb-2">{item.label}:</p>
                    <p className="text-gray-600 leading-relaxed">
                      {item.value || <span className="text-gray-400 italic">Not specified</span>}
                    </p>
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              {tab === 'review' && selectedRequest.status === 'Pending_Manager' && (
                <div className="flex justify-center space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleDecision(selectedRequest._id, 'approve')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>✓</span>
                    <span>Approve Request</span>
                  </button>
                  <button
                    onClick={() => handleDecision(selectedRequest._id, 'reject')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>✕</span>
                    <span>Reject Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPanel;
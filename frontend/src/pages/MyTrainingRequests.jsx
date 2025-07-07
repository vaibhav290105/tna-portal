import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const MyTrainingRequests = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get('/training-request/my-requests');
        setMyRequests(res.data);
      } catch {
        alert('Failed to fetch your training requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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
    const approved = myRequests.filter(r => r.status === 'Approved_By_Admin').length;
    const pending = myRequests.filter(r => r.status.includes('Pending')).length;
    const rejected = myRequests.filter(r => r.status.includes('Rejected')).length;
    
    return { approved, pending, rejected, total: myRequests.length };
  }, [myRequests]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your training requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <span>📋</span>
                <span>My Training Requests</span>
              </h1>
              <p className="text-gray-600 mt-2">Track the status of your submitted training requests</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/training-request"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>➕</span>
                <span>New Request</span>
              </Link>
              <Link
                to="/dashboard"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        {myRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <span className="text-3xl">✅</span>
                <div>
                  <p className="text-2xl font-bold text-green-600">{requestStats.approved}</p>
                  <p className="text-gray-600">Approved</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⏳</span>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{requestStats.pending}</p>
                  <p className="text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">❌</span>
                <div>
                  <p className="text-2xl font-bold text-red-600">{requestStats.rejected}</p>
                  <p className="text-gray-600">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests List */}
        {myRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Training Requests Yet</h2>
            <p className="text-gray-600 mb-6">You haven't submitted any training requests yet.</p>
            <Link
              to="/training-request"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Submit Your First Request</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Submitted</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Training Areas</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(req.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {[req.generalSkills, req.technicalSkills, req.softSkills]
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((skill, index) => (
                              <div key={index} className="truncate max-w-xs">
                                {skill.length > 50 ? `${skill.substring(0, 50)}...` : skill}
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center space-x-1 mx-auto"
                        >
                          <span>👁️</span>
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <span>📑</span>
                    <span>Training Request Details</span>
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-white hover:text-gray-200 text-2xl transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-4">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Status', value: selectedRequest.status.replace(/_/g, ' '), highlight: true },
                    { label: 'Submitted On', value: new Date(selectedRequest.createdAt).toLocaleDateString() },
                    { label: 'General Skills', value: selectedRequest.generalSkills },
                    { label: 'Tools Training', value: selectedRequest.toolsTraining },
                    { label: 'Soft Skills', value: selectedRequest.softSkills },
                    { label: 'Confidence Level', value: selectedRequest.confidenceLevel },
                    { label: 'Technical Skills', value: selectedRequest.technicalSkills },
                    { label: 'Data Training', value: selectedRequest.dataTraining },
                    { label: 'Role Challenges', value: selectedRequest.roleChallenges },
                    { label: 'Efficiency Training', value: selectedRequest.efficiencyTraining },
                    { label: 'Certifications', value: selectedRequest.certifications },
                    { label: 'Career Goals', value: selectedRequest.careerGoals },
                    { label: 'Career Training', value: selectedRequest.careerTraining },
                    { label: 'Training Format', value: selectedRequest.trainingFormat },
                    { label: 'Training Duration', value: selectedRequest.trainingDuration },
                    { label: 'Learning Preference', value: selectedRequest.learningPreference },
                    { label: 'Past Training', value: selectedRequest.pastTraining },
                    { label: 'Feedback', value: selectedRequest.pastTrainingFeedback },
                    { label: 'Improvement Suggestions', value: selectedRequest.trainingImprovement },
                    { label: 'Area Needed', value: selectedRequest.areaNeed },
                    { label: 'Frequency', value: selectedRequest.trainingFrequency }
                  ].map((item, index) => (
                    <div key={index} className={`${item.highlight ? 'md:col-span-2' : ''} bg-gray-50 p-4 rounded-lg border border-gray-200`}>
                      <p className="font-semibold text-gray-700 mb-2">{item.label}:</p>
                      <p className="text-gray-600 leading-relaxed">
                        {item.value || <span className="text-gray-400 italic">Not specified</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrainingRequests;
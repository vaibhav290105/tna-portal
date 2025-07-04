import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function MyTrainingRequests() {
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    API.get('/training-request/my-requests')
      .then((res) => setMyRequests(res.data))
      .catch(() => alert('Failed to fetch your training requests'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Training Requests</h2>

      {myRequests.length === 0 ? (
        <p className="text-gray-500">You haven’t submitted any training requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Submitted On</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((req) => (
                <tr key={req._id}>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded font-semibold ${
                        req.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : req.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
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

      {/* Modal for Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4">Training Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>General Skills:</strong> {selectedRequest.generalSkills}</p>
              <p><strong>Tools Training:</strong> {selectedRequest.toolsTraining}</p>
              <p><strong>Soft Skills:</strong> {selectedRequest.softSkills}</p>
              <p><strong>Confidence Level:</strong> {selectedRequest.confidenceLevel}</p>
              <p><strong>Technical Skills:</strong> {selectedRequest.technicalSkills}</p>
              <p><strong>Data Training:</strong> {selectedRequest.dataTraining}</p>
              <p><strong>Role Challenges:</strong> {selectedRequest.roleChallenges}</p>
              <p><strong>Efficiency Training:</strong> {selectedRequest.efficiencyTraining}</p>
              <p><strong>Certifications:</strong> {selectedRequest.certifications}</p>
              <p><strong>Career Goals:</strong> {selectedRequest.careerGoals}</p>
              <p><strong>Career Training:</strong> {selectedRequest.careerTraining}</p>
              <p><strong>Training Format:</strong> {selectedRequest.trainingFormat}</p>
              <p><strong>Training Duration:</strong> {selectedRequest.trainingDuration}</p>
              <p><strong>Learning Preference:</strong> {selectedRequest.learningPreference}</p>
              <p><strong>Past Training:</strong> {selectedRequest.pastTraining}</p>
              <p><strong>Feedback:</strong> {selectedRequest.pastTrainingFeedback}</p>
              <p><strong>Improvement Suggestions:</strong> {selectedRequest.trainingImprovement}</p>
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

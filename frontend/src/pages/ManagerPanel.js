import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function ManagerPanel() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get('/training-request/manager-pending')
      .then((res) => setRequests(res.data))
      .catch(() => alert('Failed to load requests'));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/training-request/update-status/${id}`, { status });
      setRequests((prev) =>
        prev.filter((req) => req._id !== id)
      );
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Pending Training Requests</h2>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Career Goals</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td className="border px-4 py-2">{req.user?.name}</td>
              <td className="border px-4 py-2">{req.user?.department}</td>
              <td className="border px-4 py-2">{req.careerGoals}</td>
              <td className="border px-4 py-2">
                <button onClick={() => updateStatus(req._id, 'ManagerApproved')} className="text-green-600 mr-2">Approve</button>
                <button onClick={() => updateStatus(req._id, 'Rejected')} className="text-red-600">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

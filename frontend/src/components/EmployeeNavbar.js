import React from 'react';
import { Link } from 'react-router-dom';

export default function EmployeeNavbar({ fetchSurveys }) {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Employee Dashboard</h1>
      <div className="flex gap-4">
        <Link
          to="/training-request"
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Training Request
        </Link>
        <button
          onClick={fetchSurveys}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          View Feedback Forms
        </button>
        <Link
          to="/my-training-requests"
          className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
        >
          My Training Requests
        </Link>
      </div>
    </nav>
  );
}

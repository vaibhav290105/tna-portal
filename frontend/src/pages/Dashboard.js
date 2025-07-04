import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import EmployeeNavbar from '../components/EmployeeNavbar';

export default function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSurveys, setShowSurveys] = useState(false);
  const navigate = useNavigate();

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await API.get('/survey/assigned-with-status');
      setSurveys(res.data);
      setShowSurveys(true);
    } catch (err) {
      console.error('Failed to fetch surveys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const department = localStorage.getItem('department');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <EmployeeNavbar fetchSurveys={fetchSurveys} onLogout={handleLogout} />

      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">👋 Welcome, {name || 'Employee'}!</h2>
          <p className="text-gray-600">Department: {department}</p>
          <p className="text-gray-600">Role: {role}</p>
        </div>

        {/* Survey Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-gray-800">📑 Assigned Feedback Forms</h3>
            <button
              onClick={fetchSurveys}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
            >
              Refresh
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-blue-500 font-medium">⏳ Loading feedback forms...</div>
          )}

          {/* Survey List */}
          {!loading && showSurveys && (
            <>
              {surveys.length === 0 ? (
                <p className="text-center text-gray-500">No forms assigned to you yet.</p>
              ) : (
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {surveys.map((survey) => (
                    <li
                      key={survey._id}
                      className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:shadow-md transition"
                    >
                      <a
                        href={`/survey/${survey._id}`}
                        className="block text-lg font-semibold text-blue-600 hover:underline mb-2"
                      >
                        {survey.title}
                      </a>
                      <span
                        className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                          survey.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {survey.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

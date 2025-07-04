import React, { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import EmployeeNavbar from '../components/EmployeeNavbar';

export default function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSurveys, setShowSurveys] = useState(false);

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

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const department = localStorage.getItem('department');

  return (
    <div>
      {/* Navbar */}
      <EmployeeNavbar fetchSurveys={fetchSurveys} />

      {/* Greeting */}
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-lg text-gray-700 mb-4">
          Welcome, <strong>{name}</strong> | Role: <strong>{role}</strong> | Department: <strong>{department}</strong>
        </h2>

        {/* Survey Loading Message */}
        {loading && (
          <div className="text-center text-gray-500">Loading feedback forms...</div>
        )}

        {/* Assigned Surveys */}
        {showSurveys && !loading && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Assigned Feedback Forms</h2>
            {surveys.length === 0 ? (
              <p className="text-center text-gray-500">No forms assigned to you yet.</p>
            ) : (
              <ul className="space-y-4">
                {surveys.map((survey) => (
                  <li
                    key={survey._id}
                    className="flex justify-between items-center border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link
                      to={`/survey/${survey._id}`}
                      className="text-lg font-medium text-blue-600 hover:underline"
                    >
                      {survey.title}
                    </Link>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
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
  );
}

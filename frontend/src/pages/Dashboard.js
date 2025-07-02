import React, { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

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

  return (
    <div>
      {/* Navbar */}
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
            View Assigned Surveys
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6">
        {loading && (
          <div className="text-center text-gray-500">Loading surveys...</div>
        )}

        {showSurveys && !loading && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Assigned Surveys</h2>
            {surveys.length === 0 ? (
              <p className="text-center text-gray-500">No surveys assigned to you yet.</p>
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

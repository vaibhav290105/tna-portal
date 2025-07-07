import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import EmployeeNavbar from '../components/EmployeeNavbar';
import SurveyCard from '../components/SurveyCard';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSurveys, setShowSurveys] = useState(false);
  const navigate = useNavigate();

  const userInfo = useMemo(() => ({
    name: localStorage.getItem('name'),
    role: localStorage.getItem('role'),
    department: localStorage.getItem('department')
  }), []);

  const fetchSurveys = useCallback(async () => {
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
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/');
  }, [navigate]);

  const surveyStats = useMemo(() => {
    const completed = surveys.filter(s => s.status === 'Completed').length;
    const pending = surveys.filter(s => s.status === 'Pending').length;
    return { completed, pending, total: surveys.length };
  }, [surveys]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <EmployeeNavbar fetchSurveys={fetchSurveys} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-6xl">👋</div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome back, {userInfo.name || 'Employee'}!
              </h2>
              <p className="text-gray-600 text-lg">Ready to make a difference today?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="text-blue-100">Department</p>
                  <p className="text-xl font-semibold">{userInfo.department}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-green-100">Role</p>
                  <p className="text-xl font-semibold capitalize">{userInfo.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📋</span>
              <h3 className="text-2xl font-bold text-gray-800">Feedback Forms</h3>
            </div>
            <button
              onClick={fetchSurveys}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>

          {/* Survey Stats */}
          {showSurveys && surveys.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{surveyStats.total}</div>
                <div className="text-blue-700 font-medium">Total Forms</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{surveyStats.completed}</div>
                <div className="text-green-700 font-medium">Completed</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{surveyStats.pending}</div>
                <div className="text-yellow-700 font-medium">Pending</div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-600 font-medium text-lg">Loading feedback forms...</p>
            </div>
          )}

          {/* Survey List */}
          {!loading && showSurveys && (
            <>
              {surveys.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 text-lg">No forms assigned to you yet.</p>
                  <p className="text-gray-400">Check back later for new assignments.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {surveys.map((survey) => (
                    <SurveyCard key={survey._id} survey={survey} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Initial State */}
          {!loading && !showSurveys && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-600 text-lg mb-4">Click "Refresh" to load your assigned feedback forms</p>
              <button
                onClick={fetchSurveys}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Load Forms
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
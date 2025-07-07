import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Papa from 'papaparse';

const AdminResponses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surveyTitle, setSurveyTitle] = useState('');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await API.get(`/survey/${id}/responses`);
        setResponses(res.data.responses || []);
        setQuestions(res.data.questions || []);
        setSurveyTitle(res.data.title || 'Survey Responses');
      } catch {
        alert('Failed to fetch responses');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [id]);

  const exportToCSV = () => {
    if (!responses.length) {
      alert('No data to export');
      return;
    }

    const csvData = responses.map((resp) => {
      const row = {
        Name: resp.userId?.name || 'N/A',
        Email: resp.userId?.email || 'N/A',
        Department: resp.userId?.department || 'N/A',
        'Submission Date': new Date(resp.createdAt || Date.now()).toLocaleDateString(),
      };
      questions.forEach((question, i) => {
        row[`Q${i + 1}: ${question}`] = resp.answers[i] || 'No Answer';
      });
      return row;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `survey_responses_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <span>📊</span>
                <span>Survey Responses</span>
              </h1>
              <p className="text-gray-600 mt-2">{surveyTitle}</p>
              <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                <span className="flex items-center space-x-2">
                  <span>📝</span>
                  <span>{responses.length} Responses</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span>❓</span>
                  <span>{questions.length} Questions</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {responses.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>⬇️</span>
                  <span>Export CSV</span>
                </button>
              )}
              <Link
                to="/admin"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Responses */}
        {responses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Responses Yet</h2>
            <p className="text-gray-600">This survey hasn't received any responses yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {responses.map((resp, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Response Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                        <span>👤</span>
                        <span>{resp.userId?.name || 'Anonymous'}</span>
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <span>📧</span>
                          <span>{resp.userId?.email || 'N/A'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🏢</span>
                          <span>{resp.userId?.department || 'N/A'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>📅</span>
                          <span>{new Date(resp.createdAt || Date.now()).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      Response #{i + 1}
                    </div>
                  </div>
                </div>

                {/* Response Content */}
                <div className="p-8">
                  <div className="space-y-6">
                    {questions.map((question, qIndex) => (
                      <div key={qIndex} className="border-l-4 border-blue-500 pl-6">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-start space-x-2">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium min-w-fit">
                            Q{qIndex + 1}
                          </span>
                          <span>{question}</span>
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">
                            {resp.answers[qIndex] || (
                              <span className="text-gray-400 italic">No answer provided</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {responses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <span>📈</span>
              <span>Response Summary</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{responses.length}</div>
                <div className="text-blue-700 font-medium">Total Responses</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((responses.filter(r => r.answers.every(a => a && a.trim())).length / responses.length) * 100)}%
                </div>
                <div className="text-green-700 font-medium">Complete Responses</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(responses.reduce((sum, r) => sum + r.answers.filter(a => a && a.trim()).length, 0) / (responses.length * questions.length) * 100)}%
                </div>
                <div className="text-purple-700 font-medium">Answer Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResponses;
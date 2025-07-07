import React from 'react';
import { Link } from 'react-router-dom';

const SurveyCard = ({ survey, className = '' }) => {
  const statusConfig = {
    Completed: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '✅'
    },
    Pending: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: '⏳'
    }
  };

  const config = statusConfig[survey.status] || statusConfig.Pending;

  return (
    <div className={`group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {survey.title}
        </h3>
        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
          <span>{config.icon}</span>
          <span>{survey.status}</span>
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {survey.questions?.length || 0} questions
        </div>
        <Link
          to={`/survey/${survey._id}`}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <span>Open</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default SurveyCard;
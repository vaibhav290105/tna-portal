import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const EmployeeNavbar = ({ fetchSurveys, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/training-request', label: 'Training Request', icon: '📝', color: 'green' },
    { to: '/my-training-requests', label: 'My Requests', icon: '📋', color: 'yellow' },
    { to: '/profile', label: 'Profile', icon: '👤', color: 'purple' }
  ];

  const getButtonClasses = (color) => {
    const colors = {
      green: 'bg-green-500 hover:bg-green-600 focus:ring-green-300',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300',
      purple: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-300',
      red: 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
    };
    return `${colors[color]} text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`;
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🏢</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Employee Dashboard
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`${getButtonClasses(item.color)} flex items-center space-x-2`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={onLogout}
            className={`${getButtonClasses('red')} flex items-center space-x-2`}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className={`h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
            <div className={`h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 border-t border-gray-700 pt-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`${getButtonClasses(item.color)} flex items-center space-x-2 w-full justify-center`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              onLogout();
              setIsMenuOpen(false);
            }}
            className={`${getButtonClasses('red')} flex items-center space-x-2 w-full justify-center`}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default EmployeeNavbar;
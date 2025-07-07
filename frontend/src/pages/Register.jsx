import React, { useState, useCallback } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const departments = ['HR', 'Finance', 'IT', 'Operations'];
  const roles = [
    { value: 'employee', label: 'Employee', icon: '👤' },
    { value: 'manager', label: 'Manager', icon: '👔' },
    { value: 'admin', label: 'Admin', icon: '⚡' }
  ];

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const register = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await API.post('/auth/register', formData);
      alert('✅ Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4 py-8">
      <div className="max-w-lg w-full">
        <form
          onSubmit={register}
          className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-3xl"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Our Team</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="md:col-span-2">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="md:col-span-2 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.icon} {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                name="location"
                placeholder="Location (e.g., New York, Remote)"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
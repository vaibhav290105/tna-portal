import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
      } catch {
        alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '⚡';
      case 'manager': return '👔';
      case 'employee': return '👤';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'from-purple-600 to-pink-600';
      case 'manager': return 'from-blue-600 to-indigo-600';
      case 'employee': return 'from-green-600 to-teal-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-3">
            <span>👤</span>
            <span>My Profile</span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className={`bg-gradient-to-r ${getRoleColor(user.role)} text-white p-8`}>
            <div className="text-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                {getRoleIcon(user.role)}
              </div>
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-lg opacity-90 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2 border-b border-gray-200 pb-2">
                  <span>📋</span>
                  <span>Personal Information</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <p className="text-lg text-gray-800 flex items-center space-x-2">
                      <span>📧</span>
                      <span>{user.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2 border-b border-gray-200 pb-2">
                  <span>🏢</span>
                  <span>Work Information</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                    <p className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                      <span>🏢</span>
                      <span>{user.department}</span>
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                    <p className="text-lg font-semibold text-gray-800 flex items-center space-x-2 capitalize">
                      <span>{getRoleIcon(user.role)}</span>
                      <span>{user.role}</span>
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                    <p className="text-lg text-gray-800 flex items-center space-x-2">
                      <span>📍</span>
                      <span>{user.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <span>📊</span>
                <span>Account Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">Active</div>
                  <div className="text-blue-700 font-medium">Account Status</div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">Verified</div>
                  <div className="text-green-700 font-medium">Email Status</div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{new Date().getFullYear()}</div>
                  <div className="text-purple-700 font-medium">Member Since</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <span>⚡</span>
                <span>Quick Actions</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/training-request"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-3"
                >
                  <span className="text-2xl">📝</span>
                  <div>
                    <div className="font-semibold">Submit Training Request</div>
                    <div className="text-sm opacity-90">Request new training opportunities</div>
                  </div>
                </Link>
                
                <Link
                  to="/my-training-requests"
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-3"
                >
                  <span className="text-2xl">📋</span>
                  <div>
                    <div className="font-semibold">View My Requests</div>
                    <div className="text-sm opacity-90">Track your training requests</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
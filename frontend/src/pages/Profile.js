import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => alert('Failed to load profile'));
  }, []);

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>
      <div className="space-y-3 text-sm">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Location:</strong> {user.location}</p>
      </div>
    </div>
  );
}

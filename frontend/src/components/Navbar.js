import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); 
  const name = localStorage.getItem('name'); 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold">TNA Portal</div>

      <div className="flex gap-4 items-center">
        {role === 'employee' && (
          <>
            <Link to="/training/submit" className="hover:underline">
              Submit Training
            </Link>
            <Link to="/dashboard" className="hover:underline">
              Assigned Surveys
            </Link>
          </>
        )}

        {(role === 'admin' || role === 'manager') && (
          <>
            <Link to="/training/requests" className="hover:underline">
              Training Requests
            </Link>
            <Link to="/admin" className="hover:underline">
              Admin Panel
            </Link>
          </>
        )}

        <span className="text-sm italic hidden sm:inline">Hi, {name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white ml-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

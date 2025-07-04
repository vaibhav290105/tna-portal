import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });

      const token = res.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;
      const name = decoded.name;

      localStorage.setItem('role', role);
      localStorage.setItem('name', name);

      // Role-based redirection
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={login}
      className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
      >
        Login
      </button>

      <p className="text-center text-gray-600">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}

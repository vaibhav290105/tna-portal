import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const decoded = jwtDecode(res.data.token);
    console.log(decoded);
    const role = decoded.role;
    localStorage.setItem('role', res.data.department);
    localStorage.setItem('name', res.data.name);
    localStorage.setItem('role', res.data.role);
    ;
    if (role === 'admin') {
        navigate('/admin');
    } else {
        navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={login} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block mb-2 w-full p-2 border" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block mb-2 w-full p-2 border" />
      <button className="bg-blue-500 text-white px-4 py-2">Login</button>
      <p className="mt-4">
        Don’t have an account? <Link to="/register" className="text-blue-500 underline">Register</Link>
      </p>
    </form>
  );
}

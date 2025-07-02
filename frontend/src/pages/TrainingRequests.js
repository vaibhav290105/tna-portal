import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Papa from 'papaparse';

export default function TrainingRequests() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ department: '', user: '', status: '' });

  useEffect(() => {
    API.get('/training/all')
      .then(res => {
        setRequests(res.data);
        setFiltered(res.data);
      })
      .catch(() => alert('Failed to fetch training requests'));
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const filteredData = requests.filter(req => {
      return (
        (!newFilters.department || req.department === newFilters.department) &&
        (!newFilters.user || req.user?.name.toLowerCase().includes(newFilters.user.toLowerCase())) &&
        (!newFilters.status || req.status === newFilters.status)
      );
    });

    setFiltered(filteredData);
  };

  const exportToCSV = () => {
    if (!filtered.length) return alert('No data to export');
    const csvData = filtered.map(r => ({
      Name: r.user?.name || 'N/A',
      Email: r.user?.email || 'N/A',
      Department: r.department,
      Skill: r.skill,
      Reason: r.reason,
      PreferredDate: r.date,
      Comment: r.comment,
      Status: r.status,
      SubmittedAt: new Date(r.createdAt).toLocaleString()
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'training_requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Training Requests</h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          placeholder="Search by user name"
          value={filters.user}
          onChange={(e) => handleFilterChange('user', e.target.value)}
          className="border p-2 rounded w-60"
        />
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Departments</option>
          {[...new Set(requests.map(r => r.department))].map((dep, idx) => (
            <option key={idx} value={dep}>{dep}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Department</th>
            <th className="border px-4 py-2 text-left">Skill</th>
            <th className="border px-4 py-2 text-left">Reason</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="border px-4 py-2">{r.user?.name || 'N/A'}</td>
              <td className="border px-4 py-2">{r.department}</td>
              <td className="border px-4 py-2">{r.skill}</td>
              <td className="border px-4 py-2">{r.reason}</td>
              <td className="border px-4 py-2">{r.date}</td>
              <td className="border px-4 py-2">{r.status}</td>
              <td className="border px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

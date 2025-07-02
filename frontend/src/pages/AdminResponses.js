import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Papa from 'papaparse';

export default function AdminResponses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/survey/${id}/responses`)
      .then((res) => {
        setResponses(res.data.responses || []);
        setQuestions(res.data.questions || []);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch responses');
        setLoading(false);
      });
  }, [id]);

  const exportToCSV = () => {
    if (!responses.length) return alert('No data to export');

    const csvData = responses.map((resp) => {
      const row = {
        Name: resp.userId?.name || 'N/A',
        Email: resp.userId?.email || 'N/A',
      };
      questions.forEach((question, i) => {
        row[question] = resp.answers[i] || 'No Answer'
      });
      return row;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'survey_responses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading responses...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Submitted Responses</h2>
        <Link to="/admin" className="text-blue-600 underline hover:text-blue-800">
          ← Back to Admin Panel
        </Link>
      </div>

      {responses.length === 0 ? (
        <p className="text-gray-600">No responses submitted yet.</p>
      ) : (
        <>
          <button
            onClick={exportToCSV}
            className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Export to CSV
          </button>

          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Employee</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((resp, i) => (
                <tr key={i} className="border-b">
                  <td className="border px-4 py-2">{resp.userId?.name || 'N/A'}</td>
                  <td className="border px-4 py-2">{resp.userId?.email || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    <ul className="list-disc ml-5">
                      {questions.map((q, idx) => (
                        <li key={idx}><strong>{q} </strong>: {resp.answers[idx] || 'No Answer'}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

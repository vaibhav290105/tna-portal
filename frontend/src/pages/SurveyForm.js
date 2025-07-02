import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';


export default function SurveyForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await API.get('/survey/assigned');
        const found = res.data.find((s) => s._id === id);
        if (found) {
          setSurvey(found);
          setAnswers(new Array(found.questions.length).fill(''));
        } else {
          alert('Survey not found or not assigned to you.');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id, navigate]);

  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [submitted, navigate]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      await API.post('/response/submit', { surveyId: id, answers });
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.msg || 'Already submitted');
      } else {
        alert('Failed to submit response');
      }
    }
  };

  if (loading) return <div className="p-4">Loading survey...</div>;
  if (!survey) return null;
  if (submitted) return (
    <div className="p-4 text-green-700 bg-green-100 rounded shadow">
      ✅ Thank you! Your response has been submitted.<br />
      Redirecting to dashboard...
    </div>
  );

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{survey.title}</h2>
      {survey.questions.map((q, i) => (
        <div key={i} className="mb-4">
          <label className="block mb-1 font-semibold">{q}</label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}


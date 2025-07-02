import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SurveyForm from './pages/SurveyForm';
import AdminPanel from './pages/AdminPanel';
import AdminResponses from './pages/AdminResponses';
import TrainingForm from './pages/TrainingForm';
import TrainingRequests from './pages/TrainingRequests';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey/:id" element={<SurveyForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/survey/:id/responses" element={<AdminResponses />} />
        <Route path="/training-request" element={<TrainingForm />} />
        <Route path="/training/requests" element={<TrainingRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

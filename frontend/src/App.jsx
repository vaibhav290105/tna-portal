import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SurveyForm = lazy(() => import('./pages/SurveyForm'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminResponses = lazy(() => import('./pages/AdminResponses'));
const TrainingForm = lazy(() => import('./pages/TrainingForm'));
const MyTrainingRequests = lazy(() => import('./pages/MyTrainingRequests'));
const ManagerPanel = lazy(() => import('./pages/ManagerPanel'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/survey/:id" element={<SurveyForm />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/survey/:id/responses" element={<AdminResponses />} />
              <Route path="/training-request" element={<TrainingForm />} />
              <Route path="/my-training-requests" element={<MyTrainingRequests />} />
              <Route path="/manager" element={<ManagerPanel />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
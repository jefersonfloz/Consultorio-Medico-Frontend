import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import PatientsPage from './pages/patients/PatientsPage';
import DoctorsPage from './pages/doctors/DoctorsPage';
import AppointmentsPage from './pages/appointment/AppointmentPage';
 // Agregada esta línea

// Auth utilities
import { isAuthenticated } from './utils/auth';
import ConsultRoomsPage from './pages/room/ConsultRoomPage';
import MedicalRecordsPage from './pages/records/MedicalRecordsPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Public route component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute>
              <PatientsPage />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute>
              <DoctorsPage />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/consult-rooms" element={
            <ProtectedRoute>
              <ConsultRoomsPage />
            </ProtectedRoute>
          } />

          <Route path="/records" element={
            <ProtectedRoute>
              <MedicalRecordsPage />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to dashboard or login based on auth status */}
          <Route path="/" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
          
          {/* Handle 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      
      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
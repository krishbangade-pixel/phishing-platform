import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';

// Protected Pages
import DashboardPage from '../pages/DashboardPage.jsx';
import URLScannerPage from '../pages/URLScannerPage.jsx';
import EmailAnalyzerPage from '../pages/EmailAnalyzerPage.jsx';
import MessageAnalyzerPage from '../pages/MessageAnalyzerPage.jsx';
import ScanHistoryPage from '../pages/ScanHistoryPage.jsx';
import ScanReportPage from '../pages/ScanReportPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan/url"
        element={
          <ProtectedRoute>
            <URLScannerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan/email"
        element={
          <ProtectedRoute>
            <EmailAnalyzerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan/message"
        element={
          <ProtectedRoute>
            <MessageAnalyzerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scans"
        element={
          <ProtectedRoute>
            <ScanHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scans/:id"
        element={
          <ProtectedRoute>
            <ScanReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

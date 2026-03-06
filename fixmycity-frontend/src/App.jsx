import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import useAuthStore from './store/useAuthStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDashboardPath } from './utils/roleUtils';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import AboutUs from './pages/public/AboutUs';
import IssuesList from './pages/public/IssuesList';
import CitizenDashboard from './pages/citizen/Dashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import EditIssue from './pages/citizen/EditIssue';
import MyIssues from './pages/citizen/MyIssues';
import IssueDetails from './pages/citizen/IssueDetails';
import MyBoosts from './pages/citizen/MyBoosts';
import ProfileSettings from './pages/citizen/ProfileSettings';
import Notifications from './pages/citizen/Notifications';
import CommunityFeed from './pages/citizen/CommunityFeed';
import RequestHelp from './pages/citizen/RequestHelp';
import EditHelpRequest from './pages/citizen/EditHelpRequest';
import HelpRequestDetails from './pages/citizen/HelpRequestDetails';
import MyHelpRequests from './pages/citizen/MyHelpRequests';
import MyDonations from './pages/citizen/MyDonations';
import AgentDashboard from './pages/agent/Dashboard';
import AgentReports from './pages/agent/Reports';
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageIssues from './pages/admin/ManageIssues';
import ManageHelpRequests from './pages/admin/ManageHelpRequests';
import Transactions from './pages/admin/Transactions';
import ManageCategories from './pages/admin/ManageCategories';
import ManageMunicipalities from './pages/admin/ManageMunicipalities';

import PaymentSuccess from './pages/public/PaymentSuccess';
import PaymentCancel from './pages/public/PaymentCancel';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {}
          <Route path="/boost/success" element={<PaymentSuccess />} />
          <Route path="/boost/cancel" element={<PaymentCancel />} />
          <Route path="/donation/success" element={<PaymentSuccess />} />
          <Route path="/donation/cancel" element={<PaymentCancel />} />

          {}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/issues" element={<IssuesList />} />
          <Route path="/community" element={<CommunityFeed />} />

          <Route path="/urban-issues/:id" element={<IssueDetails />} />
          <Route path="/community-help/:id" element={<HelpRequestDetails />} />

          {}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'agent', 'admin']}>
                <ReportIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/urban-issues/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <EditIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/mine"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <MyIssues />
              </ProtectedRoute>
            }
          />
          {}
          <Route
            path="/boosts/mine"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'agent']}>
                <MyBoosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'agent', 'admin']}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'agent', 'admin']}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          {}
          {}
          {}
          <Route
            path="/community/request"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'agent', 'admin']}>
                <RequestHelp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community-help/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <EditHelpRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help/mine"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <MyHelpRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donations/mine"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'agent']}>
                <MyDonations />
              </ProtectedRoute>
            }
          />
          {}

          {}
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/reports"
            element={
              <ProtectedRoute allowedRoles={['agent', 'admin']}>
                <AgentReports />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/issues"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageIssues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/community-help"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageHelpRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/municipalities"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageMunicipalities />
              </ProtectedRoute>
            }
          />

          {}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
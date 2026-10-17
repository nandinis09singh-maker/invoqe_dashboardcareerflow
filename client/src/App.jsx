import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts & Guards
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PublicOnlyRoute from './components/layout/PublicOnlyRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy Loaded Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const JobsPage = React.lazy(() => import('./pages/JobsPage'));
const JobDetailsPage = React.lazy(() => import('./pages/JobDetailsPage'));
const SavedJobsPage = React.lazy(() => import('./pages/SavedJobsPage'));
const ApplicationsPage = React.lazy(() => import('./pages/ApplicationsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const CareerPathPage = React.lazy(() => import('./pages/CareerPathPage'));
const ResumeBuilderPage = React.lazy(() => import('./pages/ResumeBuilderPage'));
const ResumeEditorPage = React.lazy(() => import('./pages/ResumeEditorPage'));
const MockInterviewPage = React.lazy(() => import('./pages/MockInterviewPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Sleek Fallback Loader
function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-900/40 animate-ping absolute inset-0" />
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wider uppercase">
        Loading CareerFlow...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                {/* PUBLIC ONLY ROUTES */}
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* PUBLIC ACCESSIBLE ROUTES */}
                <Route path="/" element={<LandingPage />} />
                
                {/* PUBLIC / PROTECTED JOBS BROWSING */}
                <Route
                  path="/jobs"
                  element={
                    <RoutesWithOrWithoutLayout>
                      <JobsPage />
                    </RoutesWithOrWithoutLayout>
                  }
                />
                <Route
                  path="/jobs/:id"
                  element={
                    <RoutesWithOrWithoutLayout>
                      <JobDetailsPage />
                    </RoutesWithOrWithoutLayout>
                  }
                />

                {/* STRICTLY PROTECTED APPLICATION ROUTES */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/career-path" element={<CareerPathPage />} />
                    <Route path="/resume-builder" element={<ResumeBuilderPage />} />
                    <Route path="/resume-builder/:id" element={<ResumeEditorPage />} />
                    <Route path="/mock-interview" element={<MockInterviewPage />} />
                    <Route path="/saved" element={<SavedJobsPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* 404 CATCH-ALL */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </React.Suspense>
          </ErrorBoundary>

          {/* Toast Notification Provider */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                borderRadius: '16px',
                fontSize: '13px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff'
                }
              }
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Helper wrapper for routes like /jobs that work for both guests and authenticated users
import { useAuth } from './context/AuthContext';
function RoutesWithOrWithoutLayout({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <AppLayout>{children}</AppLayout>;
  }
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <FooterWrapper />
    </div>
  );
}

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
function NavbarWrapper() {
  return <Navbar />;
}
function FooterWrapper() {
  return <Footer />;
}

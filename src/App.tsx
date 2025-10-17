import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// 🧩 Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// 🧩 Pages
import LoginPage from './components/auth/LoginPage';
import DashboardView from './components/views/DashboardView';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './components/views/NotFoundPage';
import './App.css';

// LayoutWrapper handles header/sidebar visibility and loading state
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Hide layout if not authenticated or on login page
  const hideLayout = location.pathname === '/login' || !isAuthenticated;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-800 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-800 dark:text-gray-200">
      {!hideLayout && <Header />}
      <div className="flex flex-1">
        {!hideLayout && <Sidebar />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <LayoutWrapper>
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardView />
                </PrivateRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LayoutWrapper>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;

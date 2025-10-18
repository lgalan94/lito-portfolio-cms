import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/sonner';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Pages
import LoginPage from './components/auth/LoginPage';
import DashboardView from './components/views/DashboardView';
import SkillsView from './components/views/SkillsView';
import SettingsView from './components/views/SettingsView';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './components/views/NotFoundPage';
import './App.css';

// Layout wrapper handles conditional rendering and loading
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-800 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  const hideLayout = !isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col text-gray-800 dark:text-gray-200 bg-slate-900">
      {/* Header */}
      {!hideLayout && <Header setIsSidebarOpen={setIsSidebarOpen} />}

      <div className="flex flex-1">
        {/* Sidebar */}
        {!hideLayout && (
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
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

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardView />
                </PrivateRoute>
              }
            />

            <Route
              path="/skills"
              element={
                <PrivateRoute>
                  <SkillsView />
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsView />
                </PrivateRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<NotFoundPage />} />
            
          </Routes>
          <Toaster richColors position="top-right" />
        </LayoutWrapper>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;

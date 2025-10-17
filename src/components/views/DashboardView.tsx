import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const DashboardView: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading user data...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.fullName}!</span>
      </p>
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Your Profile Information</h3>
        <p className="text-gray-700 dark:text-gray-400">
          <strong>ID:</strong> {user?._id}
        </p>
        <p className="text-gray-700 dark:text-gray-400">
          <strong>Email:</strong> {user?.email}
        </p>
      </div>
    </div>
  );
};

export default DashboardView;

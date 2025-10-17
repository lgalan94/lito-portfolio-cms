
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">404</h1>
      <p className="text-2xl font-semibold mt-4 mb-2">Page Not Found</p>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

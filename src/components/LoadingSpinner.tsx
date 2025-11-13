import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        'animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400',
        className
      )}
    />
  );
};

export default LoadingSpinner;

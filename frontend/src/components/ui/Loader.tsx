import React from 'react';

export type LoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
};

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '', label = 'جاري التحميل...' }) => (
  <span
    className={`inline-flex items-center justify-center ${sizeMap[size]} ${className}`}
    role="status"
    aria-live="polite"
    aria-label={label}
  >
    <svg
      className="animate-spin text-indigo-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span className="sr-only">{label}</span>
  </span>
);

export default Loader;

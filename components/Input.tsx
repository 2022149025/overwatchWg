import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-gray-300 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 [color-scheme:dark] 
        [&::-webkit-inner-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:h-full
        [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:h-full
        ${error ? 'border-red-500' : 'border-gray-600'} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default Input;
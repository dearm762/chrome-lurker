'use client'
import { FC } from 'react';

interface AlertProps {
  type: string
  message: string;
  onClose: () => void;
}

const Alert: FC<AlertProps> = ({ type, message, onClose }) => {
  const alertStyles: Record<AlertProps['type'], string> = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`border-l-4 p-4 ${alertStyles[type]} rounded-md absolute bottom-3 right-3`} role="alert">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          className="ml-4 text-lg font-bold"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
import React, { useEffect } from 'react';
import '../styles/Toast.css';

interface ErrorToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 2000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="error-toast-container">
      <div className="error-toast-message">
        {message}
      </div>
    </div>
  );
};

export default ErrorToast; 
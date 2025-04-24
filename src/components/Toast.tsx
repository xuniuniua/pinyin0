import React, { useEffect } from 'react';
import '../styles/Toast.css';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000 
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
    <div className="toast-container">
      <div className="toast-message">
        {message}
      </div>
    </div>
  );
};

// 添加体力不足提示
export const showNoStaminaToast = (setShowToast: React.Dispatch<React.SetStateAction<boolean>>) => {
  setShowToast(true);
  setTimeout(() => {
    setShowToast(false);
  }, 2000);
};

export default Toast; 
import React from 'react';
import '../styles/TimeDisplay.css';
import timeIcon from '../assets/time.png';

interface TimeDisplayProps {
  timeLeft: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeLeft }) => {
  // 格式化时间为分:秒
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="time-display-container">
      <div className="time-bubble">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default TimeDisplay; 
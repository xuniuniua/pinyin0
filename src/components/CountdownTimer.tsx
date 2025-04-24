import React, { useState, useEffect } from 'react';
import '../styles/CountdownTimer.css';

interface CountdownTimerProps {
  onCountdownComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onCountdownComplete }) => {
  const [count, setCount] = useState<number | string>(3);
  
  useEffect(() => {
    // 3秒倒计时
    const timer1 = setTimeout(() => {
      setCount(2);
    }, 1000);
    
    const timer2 = setTimeout(() => {
      setCount(1);
    }, 2000);
    
    const timer3 = setTimeout(() => {
      setCount("GO!");
    }, 3000);
    
    const timer4 = setTimeout(() => {
      onCountdownComplete();
    }, 4000);
    
    // 清理定时器
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onCountdownComplete]);
  
  return (
    <div className="countdown-timer-wrapper">
      <div className="countdown-overlay"></div>
      <div className="countdown-number">{count}</div>
    </div>
  );
};

export default CountdownTimer; 
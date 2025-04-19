import React, { useEffect } from 'react';
import '../styles/GameResultModal.css';
import successImg from '../assets/success.png';
import failImg from '../assets/fail.png';

interface GameResultModalProps {
  isVisible: boolean;
  isSuccess: boolean;
  onClose: () => void;
  onRetry: () => void;
  onNextLevel: () => void;
  onHome: () => void;
  score?: number;
  targetScore?: number;
  timeLeft?: number;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  isVisible,
  isSuccess,
  onClose,
  onRetry,
  onNextLevel,
  onHome,
  score = 0,
  targetScore = 0,
  timeLeft = 0
}) => {
  useEffect(() => {
    if (isVisible) {
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复背景滚动
      document.body.style.overflow = 'auto';
    }
    
    // 组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="result-overlay" onClick={onClose}>
      <div className="result-modal" onClick={e => e.stopPropagation()}>
        <div className="result-image-container">
          <img 
            src={isSuccess ? successImg : failImg} 
            alt={isSuccess ? "成功" : "失败"} 
            className="result-image"
          />
        </div>
        <div className="result-content">
          <div className="result-buttons">
            <button className="home-button" onClick={onHome}>返回首页</button>
            {isSuccess ? (
              <button className="next-button" onClick={onNextLevel}>下一关</button>
            ) : (
              <button className="retry-button" onClick={onRetry}>再试一次</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;
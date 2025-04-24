import React, { useEffect } from 'react';
import '../styles/GameResultModal.css';
import successImg from '../assets/success.png';
import failImg from '../assets/fail.png';
import { playSuccessMusic, playFailMusic, stopResultMusic } from '../utils/soundUtils';

interface GameResultModalProps {
  isVisible: boolean;
  isSuccess: boolean;
  onClose: () => void;
  onRetry: () => void;
  onNextLevel: () => void;
  onHome: () => void;
  score: number;
  targetScore: number;
  timeLeft: number;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  isVisible,
  isSuccess,
  onClose,
  onRetry,
  onNextLevel,
  onHome,
  score,
  targetScore,
  timeLeft
}) => {
  useEffect(() => {
    if (isVisible) {
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
      
      // 播放对应的背景音乐
      if (isSuccess) {
        playSuccessMusic();
      } else {
        playFailMusic();
      }
    } else {
      // 恢复背景滚动
      document.body.style.overflow = 'auto';
      
      // 停止背景音乐
      stopResultMusic();
    }
    
    // 组件卸载时恢复滚动，停止音乐
    return () => {
      document.body.style.overflow = 'auto';
      stopResultMusic();
    };
  }, [isVisible, isSuccess]);

  // 下一关按钮处理函数
  const handleNextLevel = () => {
    // 关闭当前模态窗
    onClose();
    // 调用外部传入的下一关处理函数
    onNextLevel();
  };

  return (
    <div className={`result-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
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
              <>
                <button className="next-button" onClick={handleNextLevel}>下一关</button>
              </>
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
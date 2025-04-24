import React, { useEffect } from 'react';
import '../styles/PauseModal.css';
import { stopResultMusic } from '../utils/soundUtils';
import { audioManager } from '../utils/audioManager';

interface PauseModalProps {
  isVisible: boolean;
  level: number;
  onContinue: () => void;
  onHome: () => void;
}

const PauseModal: React.FC<PauseModalProps> = ({ 
  isVisible, 
  level, 
  onContinue, 
  onHome 
}) => {
  useEffect(() => {
    if (isVisible) {
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
      
      // 确保停止任何可能正在播放的结果音乐
      stopResultMusic();
      
      // 暂停背景音乐
      audioManager.pauseBackgroundMusic();
    } else {
      // 恢复背景滚动
      document.body.style.overflow = 'auto';
      
      // 恢复背景音乐播放（如果之前在播放）
      audioManager.resumeBackgroundMusic();
    }
    
    // 组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  return (
    <div className={`pause-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="pause-modal">
        <div className="close-button-container">
          <button className="close-button no-highlight" onClick={onContinue}>×</button>
        </div>
        <h2 className="pause-title">暂停</h2>
        <p className="pause-level">第{level}关</p>
        
        <div className="pause-buttons">
          <button 
            className="continue-button"
            onClick={onContinue}
          >
            继续游戏
          </button>
          
          <button 
            className="home-button"
            onClick={onHome}
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseModal;
export {}; 
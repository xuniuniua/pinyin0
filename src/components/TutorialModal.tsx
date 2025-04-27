import React from 'react';
import '../styles/TutorialModal.css';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 阻止鼠标按下事件的默认行为，防止按钮获得焦点
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <h2>游戏教程</h2>
          <button 
            className="close-button" 
            onClick={onClose} 
            onMouseDown={handleMouseDown}
            tabIndex={-1} // 防止按钮获得键盘焦点
          >×</button>
        </div>
        <div className="tutorial-content">
          <h3>如何开始</h3>
          <p>选择关卡开始游戏。</p>
          <p>初始只有第一关解锁，通关后可以解锁下一关。</p>
          
          <h3>游戏玩法</h3>
          <p>游戏中会出现带汉字的地鼠，在输入框中输入正确的拼音，可以击中对应地鼠，获得分数。</p>
          <p>答对加5分，答错不扣分。</p>
          <p>每关有目标分数和时间限制，在规定时间内达到目标分数即可通关。</p>
          
          <h3>小提示</h3>
          <p>点击地鼠，可以看到对应的汉字拼音。</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal; 
import React from 'react';
import '../styles/TutorialModal.css';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <h2>游戏教程</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="tutorial-content">
          <h3>如何开始</h3>
          <p>选择关卡开始游戏。初始只有第一关解锁，完成后解锁下一关。</p>
          
          <h3>游戏玩法</h3>
          <p>游戏中会出现汉字，需要选择正确的拼音。</p>
          <p>每关有目标分数和时间限制，在规定时间内达到目标分数即可通关。</p>
          
          <h3>操作说明</h3>
          <ul>
            <li>点击选择对应的拼音</li>
            <li>答对加分，答错扣分</li>
            <li>左右滑动屏幕可以切换关卡页面</li>
          </ul>
          
          <h3>小技巧</h3>
          <p>掌握好节奏，不要着急。准确率比速度更重要！</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal; 
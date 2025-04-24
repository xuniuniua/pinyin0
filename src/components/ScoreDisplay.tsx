import React from 'react';
import '../styles/ScoreDisplay.css';

interface ScoreDisplayProps {
  currentScore: number;
  targetScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ currentScore, targetScore }) => {
  return (
    <div className="score-display-container">
      <div className="score-item">
        <div className="score-bubble">
          <span className="score-label">分数: </span>
          <span className="score-value">{currentScore}</span>
        </div>
      </div>
      <div className="score-item">
        <div className="score-bubble">
          <span className="score-label">目标: </span>
          <span className="score-value">{targetScore}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay; 
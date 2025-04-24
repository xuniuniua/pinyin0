import React from 'react';
import { Level } from '../types/game';
import '../styles/GameControls.css';

interface GameControlsProps {
  currentLevel: Level;
  score: number;
  time: number;
  isGameActive: boolean;
  isGameOver: boolean;
  isGameWon: boolean;
  onStartGame: () => void;
  onRestartGame: () => void;
  onExitGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentLevel,
  score,
  time,
  isGameActive,
  isGameOver,
  isGameWon,
  onStartGame,
  onRestartGame,
  onExitGame
}) => {
  // 格式化时间为分:秒
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-controls">
      <div className="game-info">
        <div className="level-info">
          <h3>关卡 {currentLevel.id}</h3>
        </div>
        <div className="time-info">
          <p>剩余时间: {formatTime(time)}</p>
        </div>
        <div className="score-info">
          <p>目标分数: {currentLevel.targetScore}</p>
        </div>
        <div className="current-score-info">
          <p>当前分数: {score}</p>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 
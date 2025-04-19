import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import PinyinInput from '../components/PinyinInput';
import GameControls from '../components/GameControls';
import CountdownTimer from '../components/CountdownTimer';
import GameResultModal from '../components/GameResultModal';
import { Level, Mole } from '../types/game';
import characters from '../data/characters';
import '../styles/GamePage.css';

interface GamePageProps {
  level: Level;
  onCompleteLevel: (levelId: number) => void;
}

const GamePage: React.FC<GamePageProps> = ({ level, onCompleteLevel }) => {
  console.log('GamePage接收的关卡数据:', level);
  
  const navigate = useNavigate();
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(level.timeLimit);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [moleCount, setMoleCount] = useState<number>(0);
  const [showCountdown, setShowCountdown] = useState<boolean>(true);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const maxMoles = 50; // 每关50只地鼠

  // 开始游戏
  const startGame = useCallback(() => {
    console.log('开始游戏');
    setScore(0);
    setTime(level.timeLimit);
    setMoles([]);
    setIsGameActive(true);
    setIsGameOver(false);
    setIsGameWon(false);
    setMoleCount(0);
  }, [level.timeLimit]);

  // 处理倒计时结束
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    startGame();
  }, [startGame]);

  // 随机选择一个字符
  const getRandomCharacter = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, []);

  // 获取随机位置
  const getRandomPosition = useCallback(() => {
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const activePositions = moles
      .filter(mole => mole.isActive)
      .map(mole => mole.position);
    
    const availablePositions = positions.filter(
      position => !activePositions.includes(position)
    );
    
    if (availablePositions.length === 0) {
      return -1; // 没有可用位置
    }
    
    return availablePositions[
      Math.floor(Math.random() * availablePositions.length)
    ];
  }, [moles]);

  // 创建一个新的地鼠
  const createMole = useCallback(() => {
    if (moleCount >= maxMoles || !isGameActive) {
      return;
    }

    const position = getRandomPosition();
    if (position === -1) {
      return; // 没有可用位置，跳过
    }

    const character = getRandomCharacter();
    const newMole: Mole = {
      id: Date.now(),
      character,
      position,
      isActive: true,
      isHit: false,
    };

    setMoles(prev => [...prev, newMole]);
    setMoleCount(prev => prev + 1);

    // 设置地鼠消失的定时器
    setTimeout(() => {
      setMoles(prev => 
        prev.map(mole => 
          mole.id === newMole.id ? { ...mole, isActive: false } : mole
        )
      );
    }, 4000); // 4秒后地鼠消失
  }, [getRandomCharacter, getRandomPosition, isGameActive, moleCount]);

  // 结束游戏
  const endGame = useCallback((won: boolean) => {
    console.log('游戏结束, 胜利状态:', won);
    setIsGameActive(false);
    setIsGameOver(true);
    setIsGameWon(won);
    setShowResultModal(true);

    if (won) {
      onCompleteLevel(level.id);
    }
  }, [level.id, onCompleteLevel]);

  // 处理拼音输入
  const handlePinyinSubmit = useCallback((inputPinyin: string) => {
    console.log('输入拼音:', inputPinyin);
    if (!isGameActive) return;

    // 查找匹配拼音的活跃地鼠
    const hitMoleIndex = moles.findIndex(
      mole => mole.isActive && !mole.isHit && mole.character.pinyin === inputPinyin
    );

    if (hitMoleIndex !== -1) {
      console.log('命中地鼠:', moles[hitMoleIndex]);
      // 命中地鼠
      setMoles(prev => 
        prev.map((mole, index) => 
          index === hitMoleIndex ? { ...mole, isHit: true, isActive: false } : mole
        )
      );
      
      setScore(prev => {
        const newScore = prev + 1;
        console.log('当前分数:', newScore);
        
        // 检查是否达到目标分数
        if (newScore >= level.targetScore) {
          endGame(true);
        }
        
        return newScore;
      });
    }
  }, [endGame, isGameActive, level.targetScore, moles]);

  // 组件挂载时，先显示倒计时，不自动开始游戏
  useEffect(() => {
    // 倒计时动画会自动调用startGame
    setShowCountdown(true);
  }, []);

  // 定时生成地鼠
  useEffect(() => {
    if (!isGameActive) return;

    const moleInterval = setInterval(() => {
      if (moleCount < maxMoles) {
        createMole();
      }
    }, 1000); // 每秒尝试生成一个地鼠

    return () => clearInterval(moleInterval);
  }, [createMole, isGameActive, moleCount]);

  // 倒计时
  useEffect(() => {
    if (!isGameActive) return;

    const timerInterval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          // 如果时间到，但没达到目标分数，游戏失败
          if (score < level.targetScore) {
            endGame(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [endGame, isGameActive, level.targetScore, score]);

  // 处理游戏重新开始
  const handleRestartGame = () => {
    setShowResultModal(false);
    setShowCountdown(true);
  };

  // 处理退出游戏
  const handleExitGame = () => {
    setShowResultModal(false);
    navigate('/');
  };

  // 处理关闭结果弹窗
  const handleCloseResultModal = () => {
    setShowResultModal(false);
  };

  // 处理下一关
  const handleNextLevel = () => {
    setShowResultModal(false);
    navigate('/');
  };

  return (
    <div className="game-page">
      {showCountdown && (
        <CountdownTimer onCountdownComplete={handleCountdownComplete} />
      )}
      
      <div className="game-content">
        <div className="game-left-section">
          <GameBoard moles={moles} />
          <PinyinInput 
            onPinyinSubmit={handlePinyinSubmit} 
            isGameActive={isGameActive} 
          />
        </div>
        
        <div className="game-right-section">
          <GameControls
            currentLevel={level}
            score={score}
            time={time}
            isGameActive={isGameActive}
            isGameOver={isGameOver}
            isGameWon={isGameWon}
            onStartGame={() => setShowCountdown(true)}
            onRestartGame={handleRestartGame}
            onExitGame={handleExitGame}
          />
        </div>
      </div>

      <GameResultModal
        isVisible={showResultModal}
        isSuccess={isGameWon}
        onClose={handleCloseResultModal}
        onRetry={handleRestartGame}
        onNextLevel={handleNextLevel}
        onHome={handleExitGame}
        score={score}
        targetScore={level.targetScore}
        timeLeft={time}
      />
    </div>
  );
};

export default GamePage; 
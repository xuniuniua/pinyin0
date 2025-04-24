import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import PinyinInput from '../components/PinyinInput';
import GameControls from '../components/GameControls';
import CountdownTimer from '../components/CountdownTimer';
import GameResultModal from '../components/GameResultModal';
import SoundButton from '../components/SoundButton';
import PauseButton from '../components/PauseButton';
import PauseModal from '../components/PauseModal';
import Toast from '../components/Toast';
import ErrorToast from '../components/ErrorToast';
import ScoreDisplay from '../components/ScoreDisplay';
import TimeDisplay from '../components/TimeDisplay';
import { Level, Mole } from '../types/game';
import characters from '../data/characters';
import { isStaminaEnough, expendStamina } from '../utils/staminaUtils';
import { playCharacterSound, playErrorSound, playHitSound, initAudioSystem, stopResultMusic } from '../utils/soundUtils';
import { audioManager } from '../utils/audioManager';
import '../styles/GamePage.css';

interface GamePageProps {
  level: Level;
  onCompleteLevel: (levelId: number) => void;
}

const GamePage: React.FC<GamePageProps> = ({ level, onCompleteLevel }) => {
  // 使用ref记录是否已经打印过初始化日志
  const hasLoggedInit = useRef(false);
  
  // 只在首次渲染时记录初始化日志
  if (!hasLoggedInit.current) {
    console.log(`游戏页面初始化: 关卡${level.id}`);
    hasLoggedInit.current = true;
  }
  
  const navigate = useNavigate();
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(level.timeLimit);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [moleCount, setMoleCount] = useState<number>(0);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
  const maxMoles = 50; // 每关50只地鼠

  // 开始游戏
  const startGame = useCallback(() => {
    // 检查体力值是否足够
    if (!isStaminaEnough()) {
      console.log('体力值不足，无法开始游戏');
      return;
    }

    console.log('游戏开始');
    setScore(0);
    setTime(level.timeLimit);
    setMoles([]);
    setIsGameActive(true);
    setIsGameOver(false);
    setIsGameWon(false);
    setMoleCount(0);
    
    // 确保结果音乐已停止
    stopResultMusic();
    
    // 确保背景音乐播放
    audioManager.resumeBackgroundMusic();
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
    console.log(`游戏结束: ${won ? '胜利' : '失败'}`);
    setIsGameActive(false);
    setIsGameOver(true);
    setIsGameWon(won);
    setShowResultModal(true);

    // 如果游戏失败，扣除体力值
    if (!won) {
      const success = expendStamina();
      if (!success) {
        console.log('体力值扣除失败');
      }
    }

    if (won) {
      onCompleteLevel(level.id);
    }
  }, [level.id, onCompleteLevel]);

  // 处理拼音输入
  const handlePinyinSubmit = useCallback((inputPinyin: string) => {
    if (!isGameActive) return false;

    // 查找匹配拼音的活跃地鼠
    const hitMoleIndex = moles.findIndex(
      mole => mole.isActive && !mole.isHit && mole.character.pinyin === inputPinyin
    );

    if (hitMoleIndex !== -1) {
      // 播放击打音效
      playHitSound();
      
      // 设置显示锤子
      setMoles(prev => 
        prev.map((mole, index) => 
          index === hitMoleIndex ? { ...mole, showHammer: true } : mole
        )
      );
      
      // 短暂延迟后再设置命中和播放汉字读音
      setTimeout(() => {
        // 播放命中地鼠的汉字读音
        playCharacterSound(moles[hitMoleIndex].character.char);
        
        // 命中地鼠
        setMoles(prev => 
          prev.map((mole, index) => 
            index === hitMoleIndex ? { ...mole, isHit: true, isActive: false, showHammer: false } : mole
          )
        );
        
        setScore(prev => {
          const newScore = prev + 1;
          
          // 检查是否达到目标分数
          if (newScore >= level.targetScore) {
            endGame(true);
          }
          
          return newScore;
        });
      }, 400); // 从300毫秒增加到400毫秒，给锤子动画留出更多时间
      
      // 输入成功，返回true，输入框会自动清空
      return true;
    } else {
      // 播放错误音效
      playErrorSound();
      
      // 显示错误提示
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
      }, 2000);
      
      return false;
    }
  }, [endGame, isGameActive, level.targetScore, moles]);

  // 组件挂载时，检查体力值并显示倒计时
  useEffect(() => {
    // 初始化音频系统，但不需要重新初始化背景音乐
    initAudioSystem();
    
    // 确保背景音乐已初始化（但不会重复创建）
    audioManager.initBackgroundMusic();
    
    // 只在组件挂载和关卡ID变化时检查体力值
    if (isStaminaEnough()) {
      // 倒计时动画会自动调用startGame
      setShowCountdown(true);
    } else {
      console.log('体力值不足，无法开始游戏');
    }
    
    // 重置游戏状态
    setIsGameActive(false);
    setIsGameOver(false);
    setIsGameWon(false);
    setShowResultModal(false);
    setShowPauseModal(false);
    setScore(0);
    setTime(level.timeLimit);
    setMoles([]);
    
    return () => {
      console.log(`离开关卡${level.id}`);
      // 组件卸载时重置日志标记，以便下次挂载时可以再次记录
      hasLoggedInit.current = false;
    };
  }, [level.id, level.timeLimit]);

  // 定时生成地鼠
  useEffect(() => {
    if (!isGameActive || showPauseModal) return;

    const moleInterval = setInterval(() => {
      if (moleCount < maxMoles) {
        createMole();
      }
    }, 1000); // 每秒尝试生成一个地鼠

    return () => clearInterval(moleInterval);
  }, [createMole, isGameActive, moleCount, showPauseModal]);

  // 倒计时
  useEffect(() => {
    if (!isGameActive || showPauseModal) return;

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
  }, [endGame, isGameActive, level.targetScore, score, showPauseModal]);

  // 处理游戏重新开始
  const handleRestartGame = () => {
    // 检查体力值是否足够
    if (!isStaminaEnough()) {
      console.log('体力值不足，无法重新开始游戏');
      return;
    }

    console.log('重新开始游戏');
    setShowResultModal(false);
    
    // 停止结果音乐
    stopResultMusic();
    
    // 恢复背景音乐播放
    audioManager.resumeBackgroundMusic();
    
    // 显示倒计时
    setShowCountdown(true);
  };

  // 处理退出游戏
  const handleExitGame = () => {
    console.log('退出游戏');
    setShowResultModal(false);
    setShowPauseModal(false);
    stopResultMusic(); // 确保音乐停止
    audioManager.resumeBackgroundMusic(); // 恢复背景音乐播放
    navigate('/');
  };

  // 处理关闭结果弹窗
  const handleCloseResultModal = () => {
    setShowResultModal(false);
    stopResultMusic(); // 确保音乐停止
    audioManager.resumeBackgroundMusic(); // 恢复背景音乐播放
  };

  // 处理下一关
  const handleNextLevel = () => {
    // 检查体力值是否足够
    if (!isStaminaEnough()) {
      console.log('体力值不足，无法进入下一关');
      return;
    }

    console.log(`进入下一关: ${level.id + 1}`);
    setShowResultModal(false);
    // 尝试加载下一关
    const nextLevelId = level.id + 1;
    
    // 导航到下一关
    navigate(`/game/${nextLevelId}`);
    // 倒计时会在新页面的useEffect中自动触发
  };

  // 处理暂停游戏
  const handlePauseGame = () => {
    if (isGameActive && !isGameOver) {
      console.log('游戏暂停');
      setShowPauseModal(true);
      
      // 暂停背景音乐
      audioManager.pauseBackgroundMusic();
    }
  };

  // 处理继续游戏
  const handleContinueGame = () => {
    console.log('继续游戏');
    setShowPauseModal(false);
    
    // 恢复背景音乐播放
    audioManager.resumeBackgroundMusic();
  };

  // 处理页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isGameActive && !showPauseModal && !isGameOver) {
        // 页面不可见（息屏、切换标签等）时暂停游戏
        console.log('页面不可见，自动暂停游戏');
        // 暂停背景音乐
        audioManager.pauseBackgroundMusic();
        // 显示暂停模态框
        setShowPauseModal(true);
      }
    };

    const handlePageHide = () => {
      if (isGameActive && !showPauseModal && !isGameOver) {
        // 页面隐藏时暂停游戏
        console.log('页面隐藏，自动暂停游戏');
        audioManager.pauseBackgroundMusic();
        setShowPauseModal(true);
      }
    };

    const handleBlur = () => {
      if (isGameActive && !showPauseModal && !isGameOver) {
        // 窗口失去焦点时暂停游戏
        console.log('窗口失去焦点，自动暂停游戏');
        audioManager.pauseBackgroundMusic();
        setShowPauseModal(true);
      }
    };

    // 添加页面可见性变化监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 添加页面隐藏事件监听（在移动设备上可能更可靠）
    window.addEventListener('pagehide', handlePageHide);
    
    // 添加窗口失去焦点事件监听
    window.addEventListener('blur', handleBlur);

    // 清理函数
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isGameActive, showPauseModal, isGameOver]);

  return (
    <div className="game-page">
      <div className="game-container">
        <ScoreDisplay currentScore={score} targetScore={level.targetScore} />
        
        {/* 倒计时显示，无论是倒计时动画阶段还是游戏激活阶段都显示 */}
        <TimeDisplay timeLeft={time} />
        
        {/* 暂停按钮只在游戏激活且未结束时显示 */}
        {isGameActive && !isGameOver && (
          <PauseButton onClick={handlePauseGame} />
        )}
        
        <div className="game-content">
          <div className="game-left-section">
            <GameBoard moles={moles} onPlaySound={playCharacterSound} />
            <div className="pinyin-input-wrapper">
              <ErrorToast
                message="输入错误，再试试吧！"
                isVisible={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                duration={2000}
              />
              <PinyinInput 
                onPinyinSubmit={handlePinyinSubmit} 
                isGameActive={isGameActive && !showPauseModal} 
              />
            </div>
          </div>
          
          <div className="game-right-section">
            <GameControls
              currentLevel={level}
              score={score}
              time={time}
              isGameActive={isGameActive}
              isGameOver={isGameOver}
              isGameWon={isGameWon}
              onStartGame={() => {
                // 检查体力值是否足够
                if (!isStaminaEnough()) {
                  console.log('体力值不足，无法开始游戏');
                  return;
                }
                setShowCountdown(true);
              }}
              onRestartGame={handleRestartGame}
              onExitGame={handleExitGame}
            />
          </div>
        </div>
        
        <SoundButton />
        
        {showCountdown && (
          <CountdownTimer onCountdownComplete={handleCountdownComplete} />
        )}
        
        <PauseModal
          isVisible={showPauseModal}
          level={level.id}
          onContinue={handleContinueGame}
          onHome={handleExitGame}
        />
        
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
    </div>
  );
};

export default GamePage; 
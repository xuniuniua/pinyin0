import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { Level } from '../types/game';
import '../styles/LevelSelector.css';

interface LevelSelectorProps {
  levels: Level[];
  onLevelSelect: (level: Level) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, onLevelSelect }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const levelsPerPage = 14; // 每行7关，每页显示两行
  const totalPages = Math.ceil(levels.length / levelsPerPage);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  useEffect(() => {
    console.log('LevelSelector收到的关卡数据:', levels);
  }, [levels]);

  // 处理页面变化后重置滚动位置
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 处理触摸开始
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  // 处理触摸移动
  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  // 处理触摸结束
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;  // 左滑超过50px
    const isRightSwipe = distance < -50; // 右滑超过50px
    
    if (isLeftSwipe && currentPage < totalPages - 1) {
      goToNextPage();
    }
    
    if (isRightSwipe && currentPage > 0) {
      goToPrevPage();
    }
    
    // 重置触摸状态
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 处理关卡点击
  const handleLevelClick = (level: Level) => {
    if (!level.isLocked) {
      onLevelSelect(level);
    }
  };

  // 获取当前页面的关卡
  const currentLevels = levels.slice(
    currentPage * levelsPerPage,
    (currentPage + 1) * levelsPerPage
  );
  
  // 为关卡获取背景图片样式
  const getLevelStyle = (level: Level) => {
    // 如果想为每个关卡使用不同的背景图片，可以通过关卡ID选择不同的图片
    // 例如: 特殊关卡(5、10、15等)可以有不同的背景
    if (level.isLocked) {
      return {}; // 锁定的关卡已经在CSS中设置了统一背景
    } else if (level.isCompleted) {
      return {}; // 已完成的关卡已经在CSS中设置了统一背景
    } else {
      // 这里可以根据关卡ID返回不同的背景图片
      // 例如：
      // if (level.id % 5 === 0) {
      //   return { backgroundImage: `url('../assets/level-special.png')` };
      // }
      return {}; // 默认使用CSS中设置的背景
    }
  };
  
  // 如果关卡数据为空，显示加载中
  if (levels.length === 0) {
    return (
      <div className="level-selector">
        <div className="loading-message">加载关卡数据中...</div>
      </div>
    );
  }

  return (
    <div 
      className="level-selector" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="levels-container">
        {currentLevels.map(level => (
          <div
            key={level.id}
            className={`level-button ${level.isCompleted ? 'completed' : ''} ${level.isLocked ? 'locked' : 'unlocked'}`}
            onClick={() => handleLevelClick(level)}
            style={getLevelStyle(level)}
          >
            {!level.isLocked && <span className="level-number">{level.id}</span>}
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="page-indicators">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div 
              key={index} 
              className={`page-dot ${currentPage === index ? 'active' : ''}`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LevelSelector; 
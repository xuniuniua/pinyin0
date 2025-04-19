import { useState, useEffect } from 'react';
import { Level } from '../types/game';

// 初始关卡设置
const initialLevels: Level[] = [
  { id: 1, targetScore: 5, timeLimit: 60, isLocked: false, isCompleted: false },
  { id: 2, targetScore: 10, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 3, targetScore: 15, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 4, targetScore: 20, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 5, targetScore: 25, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 6, targetScore: 30, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 7, targetScore: 35, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 8, targetScore: 40, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 9, targetScore: 45, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 10, targetScore: 50, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 11, targetScore: 55, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 12, targetScore: 60, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 13, targetScore: 65, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 14, targetScore: 70, timeLimit: 60, isLocked: true, isCompleted: false },
  { id: 15, targetScore: 75, timeLimit: 55, isLocked: true, isCompleted: false },
  { id: 16, targetScore: 80, timeLimit: 55, isLocked: true, isCompleted: false },
  { id: 17, targetScore: 85, timeLimit: 55, isLocked: true, isCompleted: false },
  { id: 18, targetScore: 90, timeLimit: 55, isLocked: true, isCompleted: false },
  { id: 19, targetScore: 95, timeLimit: 55, isLocked: true, isCompleted: false },
  { id: 20, targetScore: 100, timeLimit: 55, isLocked: true, isCompleted: false },
  { id: 21, targetScore: 105, timeLimit: 50, isLocked: true, isCompleted: false },
  { id: 22, targetScore: 110, timeLimit: 50, isLocked: true, isCompleted: false },
  { id: 23, targetScore: 115, timeLimit: 50, isLocked: true, isCompleted: false },
  { id: 24, targetScore: 120, timeLimit: 50, isLocked: true, isCompleted: false },
  { id: 25, targetScore: 125, timeLimit: 50, isLocked: true, isCompleted: false },
  { id: 26, targetScore: 130, timeLimit: 50, isLocked: true, isCompleted: false },
  { id: 27, targetScore: 135, timeLimit: 50, isLocked: true, isCompleted: false },
  { id: 28, targetScore: 140, timeLimit: 45, isLocked: true, isCompleted: false },
  { id: 29, targetScore: 145, timeLimit: 45, isLocked: true, isCompleted: false },
  { id: 30, targetScore: 150, timeLimit: 45, isLocked: true, isCompleted: false },
  { id: 31, targetScore: 155, timeLimit: 45, isLocked: true, isCompleted: false },
  { id: 32, targetScore: 160, timeLimit: 45, isLocked: true, isCompleted: false },
  { id: 33, targetScore: 165, timeLimit: 45, isLocked: true, isCompleted: false },
  { id: 34, targetScore: 170, timeLimit: 45, isLocked: true, isCompleted: false },
  { id: 35, targetScore: 175, timeLimit: 40, isLocked: true, isCompleted: false },
  { id: 36, targetScore: 180, timeLimit: 40, isLocked: true, isCompleted: false },
  { id: 37, targetScore: 185, timeLimit: 40, isLocked: true, isCompleted: false },
  { id: 38, targetScore: 190, timeLimit: 40, isLocked: true, isCompleted: false },
  { id: 39, targetScore: 195, timeLimit: 40, isLocked: true, isCompleted: false },
  { id: 40, targetScore: 200, timeLimit: 40, isLocked: true, isCompleted: false },
  { id: 41, targetScore: 205, timeLimit: 35, isLocked: true, isCompleted: false },
  { id: 42, targetScore: 210, timeLimit: 35, isLocked: true, isCompleted: false },
];

// 尝试从localStorage中获取数据的函数
const getSavedLevels = (): Level[] => {
  try {
    const savedLevels = localStorage.getItem('pinyinGameLevels');
    if (savedLevels) {
      return JSON.parse(savedLevels);
    }
  } catch (error) {
    console.error('获取本地存储数据失败:', error);
  }
  return initialLevels;
};

export const useLevels = () => {
  // 直接使用函数初始化state，确保在组件首次渲染时就有数据
  const [levels, setLevels] = useState<Level[]>(getSavedLevels());

  // 保存关卡进度到本地存储
  useEffect(() => {
    if (levels.length > 0) {
      try {
        console.log('保存关卡数据到本地存储:', levels);
        localStorage.setItem('pinyinGameLevels', JSON.stringify(levels));
      } catch (error) {
        console.error('保存关卡数据出错:', error);
      }
    }
  }, [levels]);

  // 完成关卡并解锁下一关
  const completeLevel = (levelId: number) => {
    console.log('完成关卡:', levelId);
    setLevels(prevLevels => {
      const newLevels = [...prevLevels];
      const completedLevelIndex = newLevels.findIndex(level => level.id === levelId);
      
      if (completedLevelIndex !== -1) {
        // 将当前关卡标记为已完成
        newLevels[completedLevelIndex] = {
          ...newLevels[completedLevelIndex],
          isCompleted: true
        };
        
        // 解锁下一关
        if (completedLevelIndex < newLevels.length - 1) {
          newLevels[completedLevelIndex + 1] = {
            ...newLevels[completedLevelIndex + 1],
            isLocked: false
          };
        }
      }
      
      return newLevels;
    });
  };

  // 重置所有关卡进度
  const resetLevels = () => {
    console.log('重置关卡数据');
    setLevels(initialLevels);
    localStorage.removeItem('pinyinGameLevels');
  };

  return { levels, completeLevel, resetLevels };
};

export default useLevels; 
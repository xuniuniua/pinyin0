import { useState, useEffect, useCallback } from 'react';
import { Level } from '../types/game';

// 初始关卡设置
const initialLevels: Level[] = [
  { id: 1, targetScore: 40, timeLimit: 100, isLocked: false, isCompleted: false },
  { id: 2, targetScore: 40, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 3, targetScore: 40, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 4, targetScore: 40, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 5, targetScore: 40, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 6, targetScore: 40, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 7, targetScore: 40, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 8, targetScore: 45, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 9, targetScore: 45, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 10, targetScore: 45, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 11, targetScore: 45, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 12, targetScore: 45, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 13, targetScore: 45, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 14, targetScore: 45, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 15, targetScore: 50, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 16, targetScore: 50, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 17, targetScore: 50, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 18, targetScore: 50, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 19, targetScore: 50, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 20, targetScore: 50, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 21, targetScore: 50, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 22, targetScore: 55, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 23, targetScore: 55, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 24, targetScore: 55, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 25, targetScore: 55, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 26, targetScore: 55, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 27, targetScore: 55, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 28, targetScore: 55, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 29, targetScore: 60, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 30, targetScore: 60, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 31, targetScore: 60, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 32, targetScore: 60, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 33, targetScore: 60, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 34, targetScore: 60, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 35, targetScore: 60, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 36, targetScore: 65, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 37, targetScore: 65, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 38, targetScore: 65, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 39, targetScore: 65, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 40, targetScore: 65, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 41, targetScore: 65, timeLimit: 100, isLocked: true, isCompleted: false },
  { id: 42, targetScore: 65, timeLimit: 100, isLocked: true, isCompleted: false },
];

// 尝试从localStorage中获取数据的函数
const getSavedLevels = (): Level[] => {
  try {
    const savedLevels = localStorage.getItem('moleGameLevels');
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
        localStorage.setItem('moleGameLevels', JSON.stringify(levels));
      } catch (error) {
        console.error('保存关卡数据出错:', error);
      }
    }
  }, [levels]);

  // 将关卡数据保存到本地存储
  const saveLevelsToLocalStorage = (levels: Level[]) => {
    try {
      localStorage.setItem('moleGameLevels', JSON.stringify(levels));
      // 只在保存失败时记录日志
    } catch (error) {
      console.log('保存关卡数据失败:', error);
    }
  };

  // 完成关卡
  const completeLevel = useCallback((levelId: number) => {
    console.log(`完成关卡: ${levelId}`);
    
    setLevels(prevLevels => {
      // 更新完成的关卡
      const updatedLevels = prevLevels.map(level => {
        if (level.id === levelId) {
          return { ...level, isCompleted: true };
        }
        // 解锁下一关
        if (level.id === levelId + 1) {
          return { ...level, isLocked: false };
        }
        return level;
      });
      
      // 保存更新后的关卡数据
      saveLevelsToLocalStorage(updatedLevels);
      
      return updatedLevels;
    });
  }, []);
  
  // 重置关卡数据
  const resetLevels = useCallback(() => {
    console.log('重置关卡数据');
    
    const defaultLevels = initialLevels;
    setLevels(defaultLevels);
    saveLevelsToLocalStorage(defaultLevels);

    // 强制清除localStorage中的关卡数据，确保完全重置
    try {
      localStorage.removeItem('moleGameLevels');
      console.log('已清除本地存储的关卡数据');
    } catch (error) {
      console.error('清除本地存储数据失败:', error);
    }
  }, []);

  return { levels, completeLevel, resetLevels };
};

export default useLevels; 
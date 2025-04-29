import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import CharactersPage from './pages/CharactersPage';
import useLevels from './hooks/useLevels';
import './App.css';

// 游戏路由组件
const GameRoute = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const { levels, completeLevel } = useLevels();
  
  // 查找指定关卡
  const level = levels.find(l => l.id === Number(levelId));
  
  // 精简调试日志
  console.log(`尝试加载关卡: ${levelId}`);
  
  // 如果关卡不存在或被锁定，重定向到主页
  if (!level || level.isLocked) {
    console.log('关卡不可用，重定向到主页');
    return <Navigate to="/" replace />;
  }
  
  return (
    <GamePage 
      key={`level-${level.id}`}
      level={level} 
      onCompleteLevel={completeLevel} 
    />
  );
};

const App: React.FC = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:levelId" element={<GameRoute />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:levelId" element={<CharactersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
export {};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from '../components/LevelSelector';
import TutorialModal from '../components/TutorialModal';
import SoundButton from '../components/SoundButton';
import useLevels from '../hooks/useLevels';
import { Level } from '../types/game';
import '../styles/HomePage.css';
import helpIcon from '../assets/help-icon.png';
import { isStaminaEnough } from '../utils/staminaUtils';

const HomePage: React.FC = () => {
  const { levels } = useLevels();
  const navigate = useNavigate();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  console.log('首页加载完成');

  const handleLevelSelect = (level: Level) => {
    if (!isStaminaEnough()) {
      console.log('体力值不足，无法开始游戏');
      return;
    }

    navigate(`/game/${level.id}`);
  };

  const openTutorial = () => {
    setIsTutorialOpen(true);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
  };

  return (
    <div className="home-page">
      <LevelSelector 
        levels={levels} 
        onLevelSelect={handleLevelSelect} 
      />
      
      <div className="help-button" onClick={openTutorial}>
        <img src={helpIcon} alt="帮助" />
      </div>
      
      <SoundButton />
      
      <TutorialModal isOpen={isTutorialOpen} onClose={closeTutorial} />
    </div>
  );
};

export default HomePage;
export {}; 
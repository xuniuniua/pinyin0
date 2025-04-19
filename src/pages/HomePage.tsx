import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from '../components/LevelSelector';
import TutorialModal from '../components/TutorialModal';
import useLevels from '../hooks/useLevels';
import { Level } from '../types/game';
import '../styles/HomePage.css';
import helpIcon from '../assets/help-icon.png';
import soundOnIcon from '../assets/sound-on.png';
import soundOffIcon from '../assets/sound-off.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { levels } = useLevels();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    console.log('HomePage中的关卡数据:', levels);
    // 从本地存储加载音效设置
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    if (savedSoundEnabled !== null) {
      setSoundEnabled(savedSoundEnabled === 'true');
    }
  }, [levels]);

  // 保存音效设置到本地存储
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  const handleLevelSelect = (level: Level) => {
    console.log('选择关卡:', level);
    navigate(`/game/${level.id}`);
  };

  const openTutorial = () => {
    setIsTutorialOpen(true);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="home-page">
      <LevelSelector levels={levels} onLevelSelect={handleLevelSelect} />
      
      <div className="help-button" onClick={openTutorial}>
        <img src={helpIcon} alt="帮助" />
      </div>
      
      <div className="sound-button" onClick={toggleSound}>
        <img src={soundEnabled ? soundOnIcon : soundOffIcon} alt={soundEnabled ? "关闭音效" : "开启音效"} />
      </div>
      
      <TutorialModal isOpen={isTutorialOpen} onClose={closeTutorial} />
    </div>
  );
};

export default HomePage;
export {}; 
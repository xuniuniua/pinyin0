import React, { useEffect, useState } from 'react';
import soundOnIcon from '../assets/sound-on.png';
import soundOffIcon from '../assets/sound-off.png';
import '../styles/SoundButton.css';
import { audioManager } from '../utils/audioManager';

interface SoundButtonProps {
  className?: string;
}

const SoundButton: React.FC<SoundButtonProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(false);
  
  // 组件挂载时初始化
  useEffect(() => {
    // 确保音频管理器初始化
    audioManager.initBackgroundMusic();
    
    // 从audioManager获取当前状态
    setIsMuted(audioManager.getMuted());
    
    // 注意：不需要清理，因为audioManager是全局的
  }, []);
  
  const toggleSound = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioManager.setMuted(newMutedState);
  };

  return (
    <div className={`sound-button ${className}`} onClick={toggleSound}>
      <img 
        src={isMuted ? soundOffIcon : soundOnIcon} 
        alt={isMuted ? "声音关" : "声音开"} 
      />
    </div>
  );
};

export default SoundButton; 
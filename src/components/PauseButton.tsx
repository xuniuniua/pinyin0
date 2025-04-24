import React from 'react';
import '../styles/PauseButton.css';
import pauseIcon from '../assets/pause.png';

interface PauseButtonProps {
  onClick: () => void;
}

const PauseButton: React.FC<PauseButtonProps> = ({ onClick }) => {
  return (
    <div className="pause-button no-highlight" onClick={onClick}>
      <img src={pauseIcon} alt="暂停" className="no-highlight" />
    </div>
  );
};

export default PauseButton;
export {}; 
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CharacterList from '../components/CharacterList';
import { getCharactersByLevel, getAllCharacters } from '../utils/characterUtils';
import { Character } from '../data/characters';
import '../styles/CharactersPage.css';

const CharactersPage: React.FC = () => {
  const { levelId } = useParams<{ levelId?: string }>();
  const [activeLevel, setActiveLevel] = useState<number>(levelId ? parseInt(levelId) : 1);
  const [characters, setCharacters] = useState<Character[]>([]);
  
  useEffect(() => {
    if (levelId) {
      const level = parseInt(levelId);
      setActiveLevel(level);
      const levelCharacters = getCharactersByLevel(level);
      setCharacters(levelCharacters);
    } else {
      setCharacters(getCharactersByLevel(activeLevel));
    }
  }, [levelId, activeLevel]);
  
  const handleLevelChange = (level: number) => {
    setActiveLevel(level);
    setCharacters(getCharactersByLevel(level));
  };
  
  // 生成所有可选的关卡按钮
  const renderLevelButtons = () => {
    const buttons = [];
    for (let i = 1; i <= 42; i++) {
      buttons.push(
        <button 
          key={i} 
          className={`level-button ${activeLevel === i ? 'active' : ''}`}
          onClick={() => handleLevelChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };
  
  return (
    <div className="characters-page">
      <div className="header">
        <Link to="/" className="back-link">返回首页</Link>
        <h1>汉字列表</h1>
      </div>
      
      <div className="level-selector">
        <div className="level-buttons">
          {renderLevelButtons()}
        </div>
      </div>
      
      <CharacterList 
        characters={characters} 
        title={`第${activeLevel}关汉字列表`} 
      />
    </div>
  );
};

export default CharactersPage; 
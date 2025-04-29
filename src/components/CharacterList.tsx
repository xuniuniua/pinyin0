import React from 'react';
import { Character } from '../data/characters';
import '../styles/CharacterList.css';

interface CharacterListProps {
  characters: Character[];
  title?: string;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, title = '关卡汉字列表' }) => {
  return (
    <div className="character-list-container">
      <h3 className="character-list-title">{title}</h3>
      <div className="character-list">
        {characters.map((char) => (
          <div key={char.id} className="character-item">
            <div className="character">{char.char}</div>
            <div className="pinyin">{char.pinyin}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList; 
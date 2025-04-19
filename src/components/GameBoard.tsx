import React from 'react';
import Mole from './Mole';
import { Mole as MoleType } from '../types/game';
import '../styles/GameBoard.css';
import holeImg from '../assets/hole.png';

interface GameBoardProps {
  moles: MoleType[];
}

const GameBoard: React.FC<GameBoardProps> = ({ moles }) => {
  return (
    <div className="game-board">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(position => {
        const mole = moles.find(m => m.position === position && m.isActive);
        return (
          <div key={position} className="mole-position">
            {mole ? <Mole mole={mole} /> : <img src={holeImg} alt="洞" className="mole-hole-img" />}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard; 
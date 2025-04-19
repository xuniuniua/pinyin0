import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mole as MoleType } from '../types/game';
import '../styles/Mole.css';
import moleImg from '../assets/mole.png';
import holeImg from '../assets/hole.png';

interface MoleProps {
  mole: MoleType;
}

const Mole: React.FC<MoleProps> = ({ mole }) => {
  // 动画变体
  const variants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="mole-container">
      <img src={holeImg} alt="洞" className="mole-hole-img" />
      <AnimatePresence>
        {mole.isActive && (
          <motion.div
            className={`mole ${mole.isHit ? 'hit' : ''}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <img src={moleImg} alt="地鼠" className="mole-img" />
            <div className="mole-character">{mole.character.char}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mole; 
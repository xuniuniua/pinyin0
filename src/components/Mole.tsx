import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mole as MoleType } from '../types/game';
import '../styles/Mole.css';
import moleImg from '../assets/mole.png';
import holeImg from '../assets/hole.png';
import hammerImg from '../assets/hammer.png'; // 引入锤子图片

interface MoleProps {
  mole: MoleType;
  onPlaySound?: (char: string, id: number) => void;
}

const Mole: React.FC<MoleProps> = ({ mole, onPlaySound }) => {
  const [showPinyin, setShowPinyin] = useState(false);
  
  // 监听地鼠被击中的状态变化，仅保留锤子动画效果
  
  // 动画变体 - 调整为从洞内出现的动画
  const variants = {
    hidden: { y: 30, opacity: 0 }, // 从更浅的位置开始，30而不是50
    visible: { y: 0, opacity: 1 }, // 结束位置保持不变
    exit: { y: 30, opacity: 0, transition: { duration: 0.3 } } // 退出时回到更浅的位置
  };
  
  // 锤子动画变体 - 更加夸张的动作
  const hammerVariants = {
    hidden: { rotate: 45, y: -60, x: 60, opacity: 0 },
    visible: { 
      rotate: -40, // 增大旋转角度，使动作更加夸张
      y: 0, 
      x: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.15, // 缩短动画时间，让动作更加迅速
        type: "spring",
        stiffness: 800, // 增加弹簧刚度
        damping: 15  // 减少阻尼，让动作更加有力
      } 
    },
    exit: { 
      rotate: 45, 
      y: -60, 
      x: 60, 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };
  
  // 点击地鼠的处理函数
  const handleMoleClick = () => {
    // 显示拼音气泡
    setShowPinyin(true);
    
    // 3秒后隐藏气泡
    setTimeout(() => {
      setShowPinyin(false);
    }, 3000);
    
    // 播放汉字读音
    if (onPlaySound) {
      onPlaySound(mole.character.char, mole.character.id);
    }
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
            onClick={mole.isHit ? undefined : handleMoleClick}
          >
            <img src={moleImg} alt="地鼠" className="mole-img" />
            <div className="mole-character">{mole.character.char}</div>
            
            {/* 拼音气泡 */}
            {showPinyin && (
              <motion.div 
                className="pinyin-bubble"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mole.character.pinyin}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
        
      {/* 锤子动画 - 使用图片 */}
      <AnimatePresence>
        {mole.showHammer && (
          <motion.div
            className="hammer"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={hammerVariants}
          >
            <img src={hammerImg} alt="锤子" className="hammer-img" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mole; 
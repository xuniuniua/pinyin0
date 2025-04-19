import { Character } from '../data/characters';

export interface Mole {
  id: number;
  character: Character;
  position: number; // 0-8 表示在9个洞中的位置
  isActive: boolean;
  isHit: boolean;
}

export interface Level {
  id: number;
  targetScore: number;
  timeLimit: number; // 单位：秒
  isLocked: boolean;
  isCompleted: boolean;
}

export interface GameState {
  currentLevel: Level;
  score: number;
  time: number;
  moles: Mole[];
  isGameActive: boolean;
  isGameOver: boolean;
  isGameWon: boolean;
  input: string;
} 
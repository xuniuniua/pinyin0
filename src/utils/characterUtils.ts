import characters from '../data/characters';
import { Character } from '../data/characters';

/**
 * 根据关卡ID获取对应关卡的汉字数据
 * @param levelId 关卡ID
 * @returns 对应关卡的汉字数组
 */
export const getCharactersByLevel = (levelId: number): Character[] => {
  // 每个关卡有50个汉字，根据关卡ID来计算对应的汉字范围
  const startIndex = (levelId - 1) * 50;
  const endIndex = startIndex + 50;
  
  // 返回对应范围的汉字
  return characters.slice(startIndex, endIndex);
};

/**
 * 获取所有汉字数据
 * @returns 所有汉字数组
 */
export const getAllCharacters = (): Character[] => {
  return characters;
}; 
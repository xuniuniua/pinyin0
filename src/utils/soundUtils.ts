// 导入其他工具
import { audioManager } from './audioManager';

// 导入音效文件路径
// 使用相对路径，确保正确加载
const hitSoundPath = './sounds/hit.mp3';
const errorSoundPath = './sounds/error.mp3';
const successSoundPath = './sounds/game_over_success.mp3';
const failSoundPath = './sounds/game_over_fail.mp3';
const characterSoundBasePath = './sounds/characters/';

// 音频上下文
let audioContext: AudioContext | null = null;

// 音频元素缓存
let hitAudio: HTMLAudioElement | null = null;
let errorAudio: HTMLAudioElement | null = null;
let successAudio: HTMLAudioElement | null = null;
let failAudio: HTMLAudioElement | null = null;
// 汉字发音缓存
const characterAudioCache: Record<string, HTMLAudioElement> = {};

// 游戏结果音乐播放器
let resultMusicPlayer: HTMLAudioElement | null = null;

// 确保音频只初始化一次
let isInitialized = false;

// 初始化音频系统
export const initAudioSystem = (): void => {
  if (isInitialized) {
    console.log('音频系统已经初始化');
    return;
  }
  
  try {
    // 创建音频上下文
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('音频上下文创建成功');
    } catch (err) {
      console.warn('创建音频上下文失败，将使用HTML Audio API:', err);
    }
    
    // 预加载所有音效
    const loadAudio = (path: string): HTMLAudioElement => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      try {
        audio.load();
      } catch (err) {
        console.warn(`加载音频 ${path} 失败:`, err);
      }
      return audio;
    };
    
    // 加载所有音效
    hitAudio = loadAudio(hitSoundPath);
    errorAudio = loadAudio(errorSoundPath);
    successAudio = loadAudio(successSoundPath);
    failAudio = loadAudio(failSoundPath);
    
    // 添加错误处理
    const handleError = (name: string, audio: HTMLAudioElement) => {
      audio.addEventListener('error', (e) => {
        console.warn(`${name}加载失败:`, (e.target as HTMLAudioElement).error);
        // 不设置为null，而是保留音频对象，即使加载失败也可以重试
      });
    };
    
    // 监听加载完成
    const handleLoaded = (name: string, audio: HTMLAudioElement) => {
      audio.addEventListener('canplaythrough', () => {
        console.log(`${name}预加载完成`);
      });
    };
    
    // 添加音频事件监听
    handleError('击打音效', hitAudio);
    handleError('错误音效', errorAudio);
    handleError('成功音效', successAudio);
    handleError('失败音效', failAudio);
    
    handleLoaded('击打音效', hitAudio);
    handleLoaded('错误音效', errorAudio);
    handleLoaded('成功音效', successAudio);
    handleLoaded('失败音效', failAudio);
    
    console.log('音频系统初始化完成');
    isInitialized = true;
  } catch (error) {
    console.error('初始化音频系统出错:', error);
  }
};

// 使用Web Speech API播放汉字读音
export const playCharacterSound = (char: string): void => {
  try {
    // 检查浏览器是否支持语音合成
    if (!window.speechSynthesis) {
      console.warn('当前浏览器不支持语音合成');
      return;
    }
    
    // 使用Web Speech API创建语音对象
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = 'zh-CN'; // 设置为中文
    
    // 播放声音
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('播放汉字读音失败:', error);
  }
};

// 根据汉字ID播放对应的音频文件
export const playCharacterSoundById = (characterId: number, character: string): void => {
  try {
    const audioPath = `${characterSoundBasePath}${characterId}.mp3`;
    
    // 检查缓存中是否已有该音频
    if (!characterAudioCache[characterId]) {
      // 创建新的音频对象
      const audio = new Audio(audioPath);
      audio.preload = 'auto';
      
      // 添加错误处理
      audio.addEventListener('error', (e) => {
        console.warn(`汉字ID ${characterId} (${character}) 音频加载失败:`, (e.target as HTMLAudioElement).error);
      });
      
      // 添加加载成功处理
      audio.addEventListener('canplaythrough', () => {
        console.log(`汉字ID ${characterId} (${character}) 音频加载成功`);
      });
      
      // 缓存音频对象
      characterAudioCache[characterId] = audio;
    }
    
    // 播放音频
    safePlayAudio(characterAudioCache[characterId], `汉字ID ${characterId} (${character}) 发音`);
    
  } catch (error) {
    console.error(`播放汉字ID ${characterId} (${character}) 发音失败:`, error);
  }
};

// 安全播放音频的通用函数
const safePlayAudio = (audio: HTMLAudioElement | null, name: string): void => {
  if (!audio) {
    console.warn(`${name}未初始化，无法播放`);
    return;
  }
  
  try {
    // 重置音频
    audio.currentTime = 0;
    
    // 根据音效类型设置不同的音量
    if (name === '击打音效') {
      audio.volume = 1.0; // 击打音效音量保持1.0，避免过高导致播放失败
    } else if (name === '错误音效' || name === '成功音效' || name === '失败音效') {
      audio.volume = 0.6; // 错误音效、成功音效和失败音效音量提高到0.6
    } else {
      audio.volume = 1.0; // 其他音效（包括汉字发音）音量调整为1.0
    }
    
    // 播放音频
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log(`${name}播放成功，音量: ${audio.volume}`))
        .catch(error => {
          console.warn(`${name}播放失败:`, error);
          
          // 尝试重新加载并播放
          try {
            audio.load();
            audio.play().catch(e => console.error(`${name}重试播放失败:`, e));
          } catch (reloadError) {
            console.error(`${name}重新加载失败:`, reloadError);
          }
        });
    }
  } catch (error) {
    console.error(`${name}播放出错:`, error);
  }
};

// 播放错误音效
export const playErrorSound = (): void => {
  console.log('开始播放错误音效');
  if (!errorAudio) {
    console.warn('错误音效未初始化，尝试重新加载');
    errorAudio = new Audio(errorSoundPath);
    errorAudio.preload = 'auto';
    errorAudio.load();
  }
  safePlayAudio(errorAudio, '错误音效');
};

// 播放击打地鼠的音效
export const playHitSound = (): void => {
  console.log('开始播放击打音效');
  if (!hitAudio) {
    console.warn('击打音效未初始化，尝试重新加载');
    hitAudio = new Audio(hitSoundPath);
    hitAudio.preload = 'auto';
    hitAudio.load();
  }
  safePlayAudio(hitAudio, '击打音效');
};

// 停止结果音乐
export const stopResultMusic = (): void => {
  try {
    if (resultMusicPlayer) {
      resultMusicPlayer.pause();
      resultMusicPlayer.currentTime = 0;
      resultMusicPlayer = null;
      console.log('结果音乐已停止');
    }
  } catch (error) {
    console.error('停止结果音乐失败:', error);
  }
};

// 播放成功音乐
export const playSuccessMusic = (): void => {
  try {
    // 停止之前的结果音乐
    stopResultMusic();
    
    // 暂停背景音乐
    audioManager.pauseBackgroundMusic();
    
    // 使用成功音效
    if (!successAudio) {
      console.warn('成功音效未初始化，尝试重新加载');
      successAudio = new Audio(successSoundPath);
      successAudio.preload = 'auto';
      successAudio.load();
    }
    
    console.log('开始播放成功音效');
    resultMusicPlayer = successAudio;
    safePlayAudio(successAudio, '成功音效');
  } catch (error) {
    console.error('播放成功音乐失败:', error);
  }
};

// 播放失败音乐
export const playFailMusic = (): void => {
  try {
    // 停止之前的结果音乐
    stopResultMusic();
    
    // 暂停背景音乐
    audioManager.pauseBackgroundMusic();
    
    // 使用失败音效
    if (!failAudio) {
      console.warn('失败音效未初始化，尝试重新加载');
      failAudio = new Audio(failSoundPath);
      failAudio.preload = 'auto';
      failAudio.load();
    }
    
    console.log('开始播放失败音效');
    resultMusicPlayer = failAudio;
    safePlayAudio(failAudio, '失败音效');
  } catch (error) {
    console.error('播放失败音乐失败:', error);
  }
};
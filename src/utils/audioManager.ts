// 全局音频管理器 - 用于集中管理所有音频播放

// 音频播放状态
type AudioState = {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
};

// 音频管理器类
class AudioManager {
  private backgroundAudio: HTMLAudioElement | null = null;
  private wasBackgroundPlaying: boolean = false;
  private backgroundState: AudioState = {
    isPlaying: false,
    volume: 0.1,
    currentTime: 0
  };
  private isMuted: boolean = false;
  private initialized: boolean = false;
  private initializingInProgress: boolean = false;
  private backgroundAudioPath: string = './audio/background.mp3';
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    // 从localStorage读取音频状态
    this.loadAudioStateFromStorage();
  }

  // 从localStorage读取音频状态
  private loadAudioStateFromStorage(): void {
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    if (savedSoundEnabled !== null) {
      this.isMuted = savedSoundEnabled === 'false';
      console.log(`从存储加载音频状态：${this.isMuted ? '静音' : '有声音'}`);
    }
  }

  // 初始化背景音乐 - 确保只初始化一次
  initBackgroundMusic(): void {
    // 如果已经初始化过，直接返回
    if (this.initialized || this.initializingInProgress) {
      console.log('背景音乐已经初始化过或正在初始化，跳过');
      return;
    }
    
    this.initializingInProgress = true;
    
    try {
      // 创建背景音乐元素
      this.backgroundAudio = new Audio(this.backgroundAudioPath);
      this.backgroundAudio.loop = true;
      this.backgroundAudio.preload = 'auto';
      
      // 设置初始音量
      this.backgroundAudio.volume = this.backgroundState.volume;
      console.log(`设置背景音乐音量: ${this.backgroundState.volume}`);
      
      // 处理加载错误
      this.backgroundAudio.addEventListener('error', (e) => {
        console.warn('背景音乐加载失败:', (e.target as HTMLAudioElement).error);
        
        // 尝试重新加载
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`尝试重新加载背景音乐 (${this.retryCount}/${this.maxRetries})`);
          
          setTimeout(() => {
            if (this.backgroundAudio) {
              this.backgroundAudio.load();
            }
          }, 1000);
        }
      });
      
      // 监听加载完成
      this.backgroundAudio.addEventListener('canplaythrough', () => {
        console.log('背景音乐预加载完成');
        
        // 根据静音状态决定是否播放
        if (!this.isMuted) {
          this.playBackgroundMusicInternal();
        }
      });
      
      // 加载音频
      this.backgroundAudio.load();
      
      this.initialized = true;
      console.log(`背景音乐初始化完成，当前状态：${this.isMuted ? '静音' : '有声音'}`);
    } finally {
      this.initializingInProgress = false;
    }
  }

  // 内部播放背景音乐的方法
  private playBackgroundMusicInternal(): void {
    if (!this.backgroundAudio || this.isMuted) return;
    
    // 避免重复播放
    if (!this.backgroundAudio.paused) {
      console.log('背景音乐已经在播放');
      return;
    }
    
    // 确保设置正确的音量
    this.backgroundAudio.volume = this.backgroundState.volume;
    
    const playPromise = this.backgroundAudio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.backgroundState.isPlaying = true;
          console.log(`背景音乐开始播放，音量: ${this.backgroundAudio?.volume}`);
        })
        .catch(err => {
          console.error('背景音乐播放失败:', err);
          
          // 用户未与页面交互导致的错误，不重试
          if (err.name === 'NotAllowedError') {
            console.log('用户未与页面交互，无法自动播放，等待用户交互');
            
            // 添加一次性点击事件监听器
            const clickHandler = () => {
              this.playBackgroundMusicInternal();
              document.removeEventListener('click', clickHandler);
            };
            
            document.addEventListener('click', clickHandler);
          } else {
            // 其他错误尝试重新加载并重试
            if (this.retryCount < this.maxRetries) {
              this.retryCount++;
              console.log(`尝试重新播放背景音乐 (${this.retryCount}/${this.maxRetries})`);
              
              setTimeout(() => {
                if (this.backgroundAudio) {
                  this.backgroundAudio.load();
                  this.playBackgroundMusicInternal();
                }
              }, 1000);
            }
          }
        });
    }
  }

  // 设置静音状态
  setMuted(muted: boolean): void {
    // 如果状态没变，不做操作
    if (this.isMuted === muted) {
      return;
    }
    
    this.isMuted = muted;
    
    // 保存到localStorage
    localStorage.setItem('soundEnabled', (!muted).toString());
    
    if (muted) {
      this.pauseBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    
    console.log(`设置音频状态：${muted ? '静音' : '有声音'}`);
  }

  // 获取当前静音状态
  getMuted(): boolean {
    return this.isMuted;
  }

  // 播放背景音乐
  playBackgroundMusic(): void {
    // 确保已经初始化
    if (!this.initialized) {
      this.initBackgroundMusic();
      return;
    }
    
    // 如果静音，不播放
    if (this.isMuted) {
      console.log('背景音乐处于静音状态，不播放');
      return;
    }
    
    this.playBackgroundMusicInternal();
  }

  // 暂停背景音乐
  pauseBackgroundMusic(): void {
    if (!this.backgroundAudio) {
      console.log('背景音乐未初始化，无法暂停');
      return;
    }
    
    if (!this.backgroundAudio.paused) {
      // 保存当前状态
      this.wasBackgroundPlaying = true;
      this.backgroundState.currentTime = this.backgroundAudio.currentTime;
      this.backgroundState.volume = this.backgroundAudio.volume;
      
      // 暂停播放
      this.backgroundAudio.pause();
      this.backgroundState.isPlaying = false;
      console.log('背景音乐已暂停');
    } else {
      this.wasBackgroundPlaying = false;
      console.log('背景音乐已经是暂停状态');
    }
  }

  // 恢复背景音乐播放
  resumeBackgroundMusic(): void {
    if (!this.backgroundAudio) {
      console.log('背景音乐未初始化，无法恢复');
      return;
    }
    
    if (this.wasBackgroundPlaying && !this.isMuted) {
      // 恢复到之前的时间点
      this.backgroundAudio.currentTime = this.backgroundState.currentTime;
      this.backgroundAudio.volume = this.backgroundState.volume;
      
      // 避免重复播放
      if (!this.backgroundAudio.paused) {
        console.log('背景音乐已经在播放，无需恢复');
        return;
      }
      
      this.playBackgroundMusicInternal();
    } else {
      console.log('不恢复背景音乐（静音状态或未在播放）');
    }
  }

  // 设置背景音乐音量
  setBackgroundVolume(volume: number): void {
    if (this.backgroundAudio) {
      this.backgroundAudio.volume = volume;
      this.backgroundState.volume = volume;
    }
  }

  // 获取背景音乐播放状态
  isBackgroundMusicPlaying(): boolean {
    return this.backgroundAudio ? !this.backgroundAudio.paused : false;
  }

  // 停止背景音乐
  stopBackgroundMusic(): void {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
      this.backgroundState.isPlaying = false;
      this.wasBackgroundPlaying = false;
      console.log('背景音乐已停止');
    }
  }
}

// 导出全局实例供组件使用
export const audioManager = new AudioManager(); 
import React, { useState, useRef, useEffect } from 'react';
import '../styles/PinyinInput.css';

interface PinyinInputProps {
  onPinyinSubmit: (pinyin: string) => boolean;
  isGameActive: boolean;
}

const PinyinInput: React.FC<PinyinInputProps> = ({ onPinyinSubmit, isGameActive }) => {
  const [input, setInput] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦输入框
  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGameActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 只接受字母
    const value = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    setInput(value);
  };

  const handleSubmit = () => {
    if (input.trim() === '') return;
    
    try {
      // 尝试提交拼音，获取结果
      const success = onPinyinSubmit(input.trim());
      
      // 重置输入框
      setInput('');
      
      // 无论成功与否，都重新聚焦到输入框
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
      
      // 如果输入错误，显示错误提示
      if (success === false) {
        setShowError(true);
        
        // 震动效果
        if (inputRef.current) {
          inputRef.current.classList.add('shake');
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.classList.remove('shake');
            }
            setShowError(false);
          }, 500);
        }
      }
    } catch (error) {
      console.error('提交拼音时出错:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      handleSubmit();
    }
  };

  // 当组件更新时，始终保持焦点在输入框
  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <div className="pinyin-input-container">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="输入拼音后按回车"
        disabled={!isGameActive}
        className={`pinyin-input ${showError ? 'error' : ''}`}
        autoComplete="off"
        autoCapitalize="none"
        autoFocus={isGameActive}
      />
    </div>
  );
};

export default PinyinInput; 
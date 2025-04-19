import React, { useState, useRef, useEffect } from 'react';
import '../styles/PinyinInput.css';

interface PinyinInputProps {
  onPinyinSubmit: (pinyin: string) => void;
  isGameActive: boolean;
}

const PinyinInput: React.FC<PinyinInputProps> = ({ onPinyinSubmit, isGameActive }) => {
  const [input, setInput] = useState<string>('');
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      onPinyinSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="pinyin-input-container">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="输入拼音..."
        disabled={!isGameActive}
        className="pinyin-input"
        autoComplete="off"
        autoCapitalize="none"
      />
      <button 
        onClick={() => {
          if (input.trim() !== '') {
            onPinyinSubmit(input.trim());
            setInput('');
          }
        }}
        disabled={!isGameActive || input.trim() === ''}
        className="submit-button"
      >
        提交
      </button>
    </div>
  );
};

export default PinyinInput; 
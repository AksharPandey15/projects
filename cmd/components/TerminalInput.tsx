
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onCommand: (cmd: string) => void;
  disabled: boolean;
  history: string[];
  currentPath: string;
}

const TerminalInput: React.FC<Props> = ({ onCommand, disabled, history, currentPath }) => {
  const [value, setValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCommand(value);
      setValue('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setValue(history[history.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setValue(history[history.length - 1 - nextIndex]);
      } else {
        setHistoryIndex(-1);
        setValue('');
      }
    }
  };

  return (
    <div className="flex gap-2 mt-1">
      <span className="text-[#32d74b] font-bold shrink-0">visitor@macbook-pro</span>
      <span className="text-white opacity-50 shrink-0">{currentPath}</span>
      <span className="text-[#5e5ce6] shrink-0">%</span>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus
          className="w-full bg-transparent outline-none border-none text-white p-0 caret-[#32d74b]"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default TerminalInput;

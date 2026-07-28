
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  filename: string;
  initialContent: string;
  onSave: (content: string) => void;
  onExit: () => void;
}

const NanoEditor: React.FC<Props> = ({ filename, initialContent, onSave, onExit }) => {
  const [content, setContent] = useState(initialContent);
  const [isModified, setIsModified] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + O to Save
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        onSave(content);
        setIsModified(false);
      }
      // Ctrl + X to Exit
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, onSave, onExit]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  return (
    <div className="flex flex-col h-full font-mono bg-[#1e1e1e] text-[#f0f0f0] overflow-hidden select-text">
      {/* Header */}
      <div className="bg-[#f0f0f0] text-black px-2 flex justify-between text-xs py-0.5">
        <span>GNU nano 8.0</span>
        <span className="font-bold">File: {filename}{isModified ? '*' : ''}</span>
        <span className="opacity-0">Placeholder</span>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative mt-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full bg-transparent outline-none border-none resize-none p-2 leading-relaxed whitespace-pre caret-white"
          spellCheck={false}
        />
      </div>

      {/* Footer Shortcuts */}
      <div className="bg-black/40 p-2 text-[10px] grid grid-cols-4 gap-y-1 border-t border-white/5">
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^G</span> Get Help</div>
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^O</span> Write Out</div>
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^W</span> Where Is</div>
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^K</span> Cut</div>
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^X</span> Exit</div>
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^J</span> Justify</div>
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^R</span> Read File</div>
        <div className="flex gap-2"><span className="bg-[#f0f0f0] text-black px-1 rounded-sm font-bold">^U</span> Paste</div>
      </div>
    </div>
  );
};

export default NanoEditor;

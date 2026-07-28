
import React, { useState, useRef, useEffect } from 'react';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import NanoEditor from './NanoEditor';
import { TerminalLine, LineType } from '../types';

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

interface FSNode {
  type: 'dir' | 'file';
  content?: string;
  children?: Record<string, FSNode>;
}

const INITIAL_FS: Record<string, FSNode> = {
  'Desktop': { type: 'dir', children: {} },
  'Documents': { 
    type: 'dir', 
    children: { 
      'resume.pdf': { type: 'file', content: '% PDF-1.4\n1 0 obj\n<< /Title (My Resume) /Author (Visitor) >>\nendobj' }, 
      'projects': { type: 'dir', children: {} } 
    } 
  },
  'Downloads': { 
    type: 'dir', 
    children: { 
      'setup.dmg': { type: 'file', content: '[Binary Data Content]' } 
    } 
  },
  'Library': { type: 'dir', children: {} },
  'Movies': { type: 'dir', children: {} },
  'Music': { type: 'dir', children: {} },
  'Pictures': { 
    type: 'dir', 
    children: { 
      'vacation_2024.jpg': { type: 'file', content: '[JPEG Data Placeholder]' },
      'screenshot_01.png': { type: 'file', content: '[PNG Data Placeholder]' },
      'family_photo.webp': { type: 'file', content: '[WEBP Data Placeholder]' }
    } 
  },
  'Public': { type: 'dir', children: {} },
};

const TerminalWindow: React.FC<Props> = ({ onClose, onMinimize, isMinimized }) => {
  const [currentPath, setCurrentPath] = useState('~');
  const [fileSystem, setFileSystem] = useState<FSNode>({ type: 'dir', children: INITIAL_FS });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorFile, setEditorFile] = useState<{ name: string; content: string } | null>(null);
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: LineType.SYSTEM,
      content: 'Last login: ' + new Date().toUTCString().slice(0, 25) + ' on ttys001',
      timestamp: Date.now()
    },
    {
      id: 'init-2',
      type: LineType.SYSTEM,
      content: 'Welcome to macOS Terminal. Type "help" to get started.',
      timestamp: Date.now()
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && !isEditorOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isEditorOpen]);

  const addLine = (type: LineType, content: string) => {
    setHistory(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: Date.now(),
      path: currentPath
    }]);
  };

  const getDirNode = (path: string): FSNode | null => {
    if (path === '~' || path === '') return fileSystem;
    
    const cleanPath = path.replace(/^~/, '').replace(/^\//, '').replace(/\/$/, '');
    if (!cleanPath) return fileSystem;

    const parts = cleanPath.split('/');
    let current: FSNode = fileSystem;

    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const saveFileContent = (name: string, content: string) => {
    const newFS = { ...fileSystem };
    const parts = currentPath === '~' ? [] : currentPath.split('/');
    let curr = newFS;
    
    // Build tree
    for (const p of parts) {
      if (curr.children) {
        curr.children = { ...curr.children };
        curr.children[p] = { ...curr.children[p], children: curr.children[p].children ? { ...curr.children[p].children } : undefined };
        curr = curr.children[p];
      }
    }
    
    if (curr.children) {
      curr.children = {
        ...curr.children,
        [name]: { type: 'file', content }
      };
      setFileSystem(newFS);
    }
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    addLine(LineType.INPUT, trimmedCmd);
    setCommandHistory(prev => [...prev, trimmedCmd]);

    const parts = trimmedCmd.split(/\s+/);
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (baseCmd) {
      case 'clear':
        setHistory([]);
        return;
      case 'help':
        addLine(LineType.OUTPUT, 'Available commands: cd, ls, pwd, mkdir, touch, nano, clear, whoami, help, exit');
        return;
      case 'cd': {
        const arg = args[0];
        if (!arg || arg === '~') {
          setCurrentPath('~');
        } else if (arg === '..') {
          if (currentPath !== '~') {
            const pathParts = currentPath.split('/').filter(p => p !== '~' && p !== '');
            pathParts.pop();
            setCurrentPath(pathParts.length === 0 ? '~' : pathParts.join('/'));
          }
        } else {
          const currentPathClean = currentPath === '~' ? '' : currentPath;
          const targetPath = currentPathClean === '' ? arg : `${currentPathClean}/${arg}`;
          
          const node = getDirNode(targetPath);
          if (node && node.type === 'dir') {
            setCurrentPath(targetPath.replace(/\/$/, ''));
          } else {
            addLine(LineType.ERROR, `cd: no such file or directory: ${arg}`);
          }
        }
        return;
      }
      case 'ls': {
        const node = getDirNode(currentPath);
        if (node && node.children) {
          const names = Object.keys(node.children).sort();
          if (names.length > 0) {
            addLine(LineType.OUTPUT, names.join('  '));
          }
        } else {
          addLine(LineType.ERROR, `ls: directory access error`);
        }
        return;
      }
      case 'pwd': {
        const pathSuffix = currentPath === '~' ? '' : `/${currentPath}`;
        addLine(LineType.OUTPUT, `/Users/visitor${pathSuffix}`);
        return;
      }
      case 'whoami':
        addLine(LineType.OUTPUT, 'visitor');
        return;
      case 'nano': {
        const name = args[0];
        if (!name) {
          addLine(LineType.ERROR, 'nano: missing filename');
          return;
        }
        const node = getDirNode(currentPath);
        const existingFile = node?.children?.[name];
        
        if (existingFile && existingFile.type === 'dir') {
          addLine(LineType.ERROR, `nano: ${name} is a directory`);
          return;
        }

        setEditorFile({
          name,
          content: existingFile?.content || ''
        });
        setIsEditorOpen(true);
        return;
      }
      case 'mkdir': {
        const name = args[0];
        if (!name) {
          addLine(LineType.ERROR, 'mkdir: missing operand');
          return;
        }
        const node = getDirNode(currentPath);
        if (node && node.children) {
          if (node.children[name]) {
            addLine(LineType.ERROR, `mkdir: ${name}: File exists`);
          } else {
            const newFS = { ...fileSystem };
            const parts = currentPath === '~' ? [] : currentPath.split('/');
            let curr = newFS;
            for (const p of parts) {
              if (curr.children) curr.children[p] = { ...curr.children[p], children: { ...curr.children[p].children } };
              curr = curr.children![p];
            }
            curr.children = { ...curr.children, [name]: { type: 'dir', children: {} } };
            setFileSystem(newFS);
          }
        }
        return;
      }
      case 'touch': {
        const name = args[0];
        if (!name) return;
        const node = getDirNode(currentPath);
        if (node && node.children) {
          if (!node.children[name]) {
            saveFileContent(name, '');
          }
        }
        return;
      }
      case 'exit':
        onClose();
        return;
      default:
        addLine(LineType.ERROR, `zsh: command not found: ${baseCmd}`);
    }
  };

  if (isMinimized) return null;

  return (
    <div className="w-full max-w-4xl h-[600px] flex flex-col rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 animate-in fade-in zoom-in duration-300 relative z-20">
      {/* Title Bar */}
      <div className="h-10 bg-[#323232] flex items-center px-4 select-none cursor-default">
        <div className="flex gap-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center transition-all">
            <span className="text-[7px] text-black/50 opacity-0 hover:opacity-100 font-bold">✕</span>
          </button>
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center transition-all">
            <span className="text-[10px] text-black/50 opacity-0 hover:opacity-100 font-bold">−</span>
          </button>
          <button className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 flex items-center justify-center transition-all">
            <span className="text-[7px] text-black/50 opacity-0 hover:opacity-100 font-bold">⤢</span>
          </button>
        </div>
        <div className="flex-1 text-center text-[11px] font-medium text-gray-400 flex items-center justify-center gap-2">
          <span className="opacity-50">📁</span>
          visitor — {currentPath} — {isEditorOpen ? 'nano' : 'zsh'} — 80×24
        </div>
      </div>

      {/* Terminal Content or Editor */}
      <div 
        ref={scrollRef}
        className={`flex-1 overflow-hidden font-mono text-sm leading-relaxed ${isEditorOpen ? '' : 'overflow-y-auto p-4'}`}
      >
        {isEditorOpen && editorFile ? (
          <NanoEditor 
            filename={editorFile.name}
            initialContent={editorFile.content}
            onSave={(content) => saveFileContent(editorFile.name, content)}
            onExit={() => setIsEditorOpen(false)}
          />
        ) : (
          <>
            <TerminalOutput history={history} />
            <TerminalInput 
              onCommand={executeCommand} 
              disabled={false}
              history={commandHistory}
              currentPath={currentPath}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TerminalWindow;

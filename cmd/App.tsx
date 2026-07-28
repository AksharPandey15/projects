
import React, { useState } from 'react';
import TerminalWindow from './components/TerminalWindow';
import SystemInfoWindow from './components/SystemInfoWindow';

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1617957718614-8c23f060c2d0?auto=format&fit=crop&q=80&w=2400',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=2400',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2400',
  'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=2400'
];

const App: React.FC = () => {
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [isTerminalClosed, setIsTerminalClosed] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  const toggleTerminal = () => {
    setIsTerminalClosed(false);
    setIsTerminalMinimized(false);
  };

  const nextWallpaper = () => {
    setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length);
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center transition-all duration-700 ease-in-out p-4 md:p-8 overflow-hidden select-none"
      style={{ backgroundImage: `url(${WALLPAPERS[wallpaperIndex]})` }}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Terminal Window */}
      {!isTerminalClosed && !isTerminalMinimized && (
        <TerminalWindow 
          onClose={() => setIsTerminalClosed(true)} 
          onMinimize={() => setIsTerminalMinimized(true)} 
          isMinimized={isTerminalMinimized}
        />
      )}

      {/* System Info Window */}
      {isSystemInfoOpen && (
        <SystemInfoWindow onClose={() => setIsSystemInfoOpen(false)} />
      )}

      {/* Dock Area */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-2xl px-4 py-2 rounded-3xl flex gap-4 border border-white/20 shadow-2xl items-end pb-3">
        {/* Terminal App */}
        <div className="group flex flex-col items-center gap-1">
          <button 
            onClick={toggleTerminal}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/10"
          >
            _&gt;
          </button>
          {!isTerminalClosed && <div className="w-1 h-1 rounded-full bg-white/80" />}
        </div>

        {/* Wallpaper Switcher (Sky Blue) */}
        <div className="group flex flex-col items-center gap-1">
          <button 
            onClick={nextWallpaper}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/10 flex items-center justify-center"
          >
            <span className="text-white text-xl">🖼️</span>
          </button>
        </div>

        {/* System Info (Orange) */}
        <div className="group flex flex-col items-center gap-1">
          <button 
            onClick={() => setIsSystemInfoOpen(true)}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-300 to-orange-500 shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/10 flex items-center justify-center"
          >
            <span className="text-white text-xl">ℹ️</span>
          </button>
          {isSystemInfoOpen && <div className="w-1 h-1 rounded-full bg-white/80" />}
        </div>
      </div>

      {/* Top Menu Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md px-4 flex items-center justify-between text-white text-sm font-medium border-b border-white/5">
        <div className="flex gap-4 items-center">
          <span className="font-bold"></span>
          <span className="font-semibold">Terminal</span>
          <span className="opacity-80 font-normal hidden sm:inline">File</span>
          <span className="opacity-80 font-normal hidden sm:inline">Edit</span>
          <span className="opacity-80 font-normal hidden sm:inline">View</span>
          <span className="opacity-80 font-normal hidden sm:inline">Window</span>
          <span className="opacity-80 font-normal hidden sm:inline">Help</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="opacity-80">100% [🔋]</span>
          <span className="opacity-80">Wi-Fi</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

export default App;

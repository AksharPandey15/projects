
import React from 'react';

interface Props {
  onClose: () => void;
}

const SystemInfoWindow: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="w-[450px] bg-neutral-800/90 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 absolute z-50">
      <div className="h-10 flex items-center px-4 relative">
        <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-semibold text-white/80">About This Mac</span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col items-center text-white">
        <div className="w-24 h-24 bg-gradient-to-tr from-gray-400 to-gray-600 rounded-2xl mb-6 shadow-xl flex items-center justify-center text-5xl">
          
        </div>
        <h2 className="text-2xl font-bold mb-1">macOS Sequoia</h2>
        <p className="text-sm text-white/50 mb-6">Version 15.1</p>
        
        <div className="w-full space-y-3 text-sm px-4">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/60">Processor</span>
            <span className="font-medium">Apple M3 Max</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/60">Memory</span>
            <span className="font-medium">64 GB</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/60">Graphics</span>
            <span className="font-medium">Apple M3 Max 40-Core GPU</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Serial Number</span>
            <span className="font-medium uppercase tracking-wider">C02XT1YPF1R</span>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-8 px-6 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm border border-white/10 transition-colors"
        >
          System Report...
        </button>
      </div>
    </div>
  );
};

export default SystemInfoWindow;

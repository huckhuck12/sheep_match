import React from 'react';
import { Play, LogOut } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ isOpen, onResume, onQuit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border-4 border-green-800 animate-modal">
        <h2 className="text-3xl font-black text-gray-800 mb-6">
          游戏暂停
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xl shadow-[0_4px_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            <Play size={24} fill="currentColor" /> 继续游戏
          </button>
          
          <button
            onClick={onQuit}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xl border-2 border-gray-300 shadow-sm active:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <LogOut size={24} /> 退出到菜单
          </button>
        </div>
      </div>
    </div>
  );
};
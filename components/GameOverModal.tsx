import React, { useEffect, useState } from 'react';
import { GameStatus } from '../types';
import { generateGameCommentary } from '../services/geminiService';
import { RefreshCw, Trophy, Skull } from 'lucide-react';

interface GameOverModalProps {
  status: GameStatus;
  onRestart: () => void;
  moveCount: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ status, onRestart, moveCount }) => {
  const [aiMessage, setAiMessage] = useState<string>("正在询问羊村长...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMessage = async () => {
      if (status !== GameStatus.WON && status !== GameStatus.LOST) return;
      setIsLoading(true);
      const msg = await generateGameCommentary(status === GameStatus.WON ? 'WON' : 'LOST', moveCount);
      if (isMounted) {
        setAiMessage(msg || "");
        setIsLoading(false);
      }
    };

    fetchMessage();
    return () => { isMounted = false; };
  }, [status, moveCount]);

  if (status !== GameStatus.WON && status !== GameStatus.LOST) return null;

  const isWon = status === GameStatus.WON;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border-4 border-green-800 animate-modal">
        <div className="flex justify-center mb-4">
          {isWon ? (
            <div className="p-4 bg-yellow-100 rounded-full animate-bounce">
              <Trophy className="w-12 h-12 text-yellow-600" />
            </div>
          ) : (
            <div className="p-4 bg-red-100 rounded-full animate-pulse">
              <Skull className="w-12 h-12 text-red-600" />
            </div>
          )}
        </div>
        
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          {isWon ? "羊群之王！" : "挑战失败"}
        </h2>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 min-h-[80px] flex items-center justify-center">
          {isLoading ? (
             <div className="flex gap-2">
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
             </div>
          ) : (
            <p className="text-gray-600 italic text-sm leading-relaxed">
              "{aiMessage}"
            </p>
          )}
        </div>

        <button
          onClick={onRestart}
          className={`
            w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2
            ${isWon ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-900/20' : 'bg-green-600 hover:bg-green-700 shadow-green-900/20'}
          `}
        >
          <RefreshCw className="w-6 h-6" />
          {isWon ? "再玩一次" : "重新挑战"}
        </button>
      </div>
    </div>
  );
};
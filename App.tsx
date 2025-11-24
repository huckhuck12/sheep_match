import React, { useState, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { SlotBar } from './components/SlotBar';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { TileData, GameStatus } from './types';
import { generateLevel, updateClickability } from './services/gameLogic';
import { MAX_SLOTS, LEVEL_CONFIG } from './constants';
import { Play, RotateCcw, Shuffle, Pause } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [boardTiles, setBoardTiles] = useState<TileData[]>([]);
  const [slotTiles, setSlotTiles] = useState<TileData[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [levelDifficulty, setLevelDifficulty] = useState<'EASY' | 'HARD'>('EASY');
  
  // 动画状态
  const [matchingTileIds, setMatchingTileIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 初始化游戏
  const startGame = useCallback((difficulty: 'EASY' | 'HARD') => {
    const config = LEVEL_CONFIG[difficulty];
    const newBoard = generateLevel(config);
    setBoardTiles(newBoard);
    setSlotTiles([]);
    setMoveCount(0);
    setMatchingTileIds([]);
    setIsProcessing(false);
    setStatus(GameStatus.PLAYING);
    setLevelDifficulty(difficulty);
  }, []);

  // 核心游戏循环逻辑：处理点击
  const handleTileClick = (clickedTile: TileData) => {
    if (status !== GameStatus.PLAYING || isProcessing) return;
    
    // 1. 从棋盘移除
    const newBoard = boardTiles.filter(t => t.id !== clickedTile.id);
    
    // 2. 重新计算剩余棋盘的可点击性
    const updatedBoard = updateClickability(newBoard);
    setBoardTiles(updatedBoard);

    // 3. 添加到槽位
    const nextSlots = [...slotTiles, clickedTile];
    setMoveCount(prev => prev + 1);

    // 对槽位排序以分组相同物品（经典机制辅助）
    nextSlots.sort((a, b) => a.type.localeCompare(b.type));
    
    // 立即更新视觉效果，以便用户看到槽位中的方块
    setSlotTiles(nextSlots);

    // 4. 检查匹配
    // 寻找任何三连
    const typeCounts: Record<string, number> = {};
    nextSlots.forEach(t => {
      typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
    });

    // 识别要移除的类型（计数 >= 3）
    const matchType = Object.keys(typeCounts).find(type => typeCounts[type] >= 3);

    if (matchType) {
      // 找到要移除的 ID（该类型的前 3 个）
      const idsToRemove: string[] = [];
      let count = 0;
      nextSlots.forEach(t => {
        if (t.type === matchType && count < 3) {
          idsToRemove.push(t.id);
          count++;
        }
      });
      
      // 锁定输入
      setIsProcessing(true);

      // 两步动画：
      // 1. 等待 200ms 让新方块“弹出”并稳定
      // 2. 触发匹配动画
      // 3. 等待 400ms 让匹配动画完成 -> 移除方块

      setTimeout(() => {
        // 开始匹配动画
        setMatchingTileIds(idsToRemove);

        // 等待匹配动画完成
        setTimeout(() => {
          const filteredSlots = nextSlots.filter(t => !idsToRemove.includes(t.id));
          setSlotTiles(filteredSlots);
          setMatchingTileIds([]);
          setIsProcessing(false);

          // 胜利条件检查
          // 检查棋盘是否为空且槽位是否为空
          if (updatedBoard.length === 0 && filteredSlots.length === 0) {
            setStatus(GameStatus.WON);
          }
        }, 400); // 时长匹配 CSS .animate-match
      }, 250); // 弹出动画延迟
      
    } else {
      // 无匹配
      // 失败条件：无匹配且槽位已满
      if (nextSlots.length >= MAX_SLOTS) {
        // 增加一点延迟，让用户在游戏结束前看到满槽
        setIsProcessing(true);
        setTimeout(() => {
           setStatus(GameStatus.LOST);
           setIsProcessing(false);
        }, 500);
      }
    }
  };

  // 道具：洗牌
  const handleShuffle = () => {
    if (status !== GameStatus.PLAYING || boardTiles.length === 0 || isProcessing) return;
    
    // 位置上的 Fisher-Yates 洗牌
    const currentPositions = boardTiles.map(t => ({ x: t.x, y: t.y, layer: t.layer, zIndex: t.zIndex }));
    
    // 打乱当前方块数组（它们的身份）
    const shuffledTiles = [...boardTiles];
    for (let i = shuffledTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
    }
    
    // 重新分配位置
    const newBoard = shuffledTiles.map((tile, index) => ({
      ...tile,
      x: currentPositions[index].x,
      y: currentPositions[index].y,
      layer: currentPositions[index].layer,
      zIndex: currentPositions[index].zIndex,
    }));
    
    setBoardTiles(updateClickability(newBoard));
  };

  // 道具：撤销（将最后一个槽位方块移回棋盘）
  const handleUndo = () => {
    if (status !== GameStatus.PLAYING || slotTiles.length === 0 || isProcessing) return;
    
    // 从槽位取出最后一个方块
    const tileToReturn = slotTiles[slotTiles.length - 1];
    const newSlots = slotTiles.slice(0, slotTiles.length - 1);
    
    const maxLayer = boardTiles.reduce((max, t) => Math.max(max, t.layer), 0);
    const gridSize = LEVEL_CONFIG[levelDifficulty].gridSize;
    
    const returnedTile: TileData = {
      ...tileToReturn,
      layer: maxLayer + 1,
      zIndex: (maxLayer + 1) * 100,
      x: Math.floor(Math.random() * (gridSize - 2)) + 1,
      y: Math.floor(Math.random() * (gridSize - 2)) + 1,
    };
    
    const newBoard = [...boardTiles, returnedTile];
    setBoardTiles(updateClickability(newBoard));
    setSlotTiles(newSlots);
  };

  // 菜单屏幕
  if (status === GameStatus.MENU) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#c6e6a6] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-[0_10px_0_rgba(0,0,0,0.1)] border-4 border-green-800 text-center max-w-sm w-full animate-modal">
          <div className="text-6xl mb-4 animate-bounce">🐑</div>
          <h1 className="text-4xl font-black text-green-900 mb-2">羊了个羊</h1>
          <p className="text-gray-600 mb-8">只有0.1%的人能通过地狱难度。</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => startGame('EASY')}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-xl shadow-[0_4px_0_rgb(29,78,216)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Play size={24} /> 简单模式
            </button>
            <button 
              onClick={() => startGame('HARD')}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xl shadow-[0_4px_0_rgb(185,28,28)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <div className="font-black">🔥</div> 地狱难度
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-green-900 opacity-60 font-bold text-sm">
          致敬《羊了个羊》
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#c6e6a6] overflow-hidden relative">
      
      {/* 顶部栏 */}
      <div className="pt-6 px-4 flex justify-between items-start max-w-lg mx-auto w-full">
         <button 
          onClick={() => setStatus(GameStatus.PAUSED)}
          className="bg-white p-2 rounded-lg shadow-sm border-2 border-green-800 text-green-800 hover:bg-green-50 transition-colors"
          title="暂停"
        >
          <Pause size={24} fill="currentColor" className="text-green-800" />
        </button>
        <div className="text-green-900 font-bold text-xl">
           难度: {levelDifficulty === 'EASY' ? '简单' : '地狱'}
        </div>
      </div>

      {/* 主棋盘区域 */}
      <div className="flex-grow flex items-center justify-center p-4 overflow-visible">
        <GameBoard 
          tiles={boardTiles} 
          onTileClick={handleTileClick}
          gridSize={LEVEL_CONFIG[levelDifficulty].gridSize}
        />
      </div>

      {/* 控制和槽位 */}
      <div className="pb-8 pt-4 px-4 w-full max-w-md mx-auto flex flex-col gap-6 z-20">
        
        {/* 道具区域 */}
        <div className="flex justify-center gap-6">
           <button 
            onClick={handleUndo}
            disabled={slotTiles.length === 0 || isProcessing}
            className="flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed group transition-transform active:scale-95"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#1e40af] active:translate-y-1 active:shadow-none transition-all">
              <RotateCcw size={24} />
            </div>
            <span className="text-xs font-bold text-green-900">撤销</span>
          </button>

          <button 
            onClick={handleShuffle}
             disabled={isProcessing}
            className="flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed group transition-transform active:scale-95"
          >
            <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#6b21a8] active:translate-y-1 active:shadow-none transition-all">
              <Shuffle size={24} />
            </div>
            <span className="text-xs font-bold text-green-900">洗牌</span>
          </button>
        </div>

        {/* 槽位栏 */}
        <SlotBar tiles={slotTiles} matchingTileIds={matchingTileIds} />
      </div>

      <PauseModal 
        isOpen={status === GameStatus.PAUSED}
        onResume={() => setStatus(GameStatus.PLAYING)}
        onQuit={() => setStatus(GameStatus.MENU)}
      />

      <GameOverModal 
        status={status} 
        onRestart={() => startGame(levelDifficulty)} 
        moveCount={moveCount}
      />
    </div>
  );
};

export default App;
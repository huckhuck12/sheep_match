import React from 'react';
import { TileData } from '../types';
import { Tile } from './Tile';
import { MAX_SLOTS } from '../constants';

interface SlotBarProps {
  tiles: TileData[];
  matchingTileIds: string[];
}

export const SlotBar: React.FC<SlotBarProps> = ({ tiles, matchingTileIds }) => {
  // Create an array of 7 slots
  const slots = Array.from({ length: MAX_SLOTS });

  return (
    <div className="w-full max-w-md h-24 bg-[#8b5a2b] rounded-xl border-4 border-[#5c3a1b] flex items-center justify-center px-2 gap-1 relative shadow-2xl transition-all duration-300">
      {/* Wood texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      
      {slots.map((_, index) => {
        const tile = tiles[index];
        const isMatching = tile ? matchingTileIds.includes(tile.id) : false;
        
        return (
          <div 
            key={index} 
            className="w-12 h-12 rounded bg-[#6d4521] bg-opacity-50 flex items-center justify-center transition-all"
          >
            {tile && (
              <Tile 
                key={tile.id}
                data={tile} 
                onClick={() => {}} 
                isInSlot={true}
                isMatching={isMatching}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
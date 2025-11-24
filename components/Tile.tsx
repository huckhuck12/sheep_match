import React from 'react';
import { TileData } from '../types';
import { TILE_ICONS, TILE_SIZE } from '../constants';

interface TileProps {
  data: TileData;
  onClick: (tile: TileData) => void;
  isInSlot?: boolean;
  isMatching?: boolean;
}

export const Tile: React.FC<TileProps> = ({ data, onClick, isInSlot, isMatching }) => {
  const icon = TILE_ICONS[data.type];

  // Dynamic styles for positioning
  const positionStyle: React.CSSProperties = isInSlot
    ? {
        // Position relative in the flex container
        position: 'relative',
        zIndex: 10,
      }
    : {
        position: 'absolute',
        left: `${data.x * TILE_SIZE}px`,
        top: `${data.y * TILE_SIZE}px`,
        zIndex: data.zIndex,
        transition: 'all 0.2s ease-out',
      };

  // Visual state
  const isClickable = data.isClickable;
  const brightness = isClickable ? 'brightness-100' : 'brightness-50 bg-gray-200';
  const cursor = isClickable ? 'cursor-pointer' : 'cursor-not-allowed';
  const shadow = isInSlot ? 'shadow-sm' : 'shadow-[0_4px_0_rgb(0,0,0,0.2)]';
  const activeEffect = isClickable ? 'active:translate-y-[2px] active:shadow-none' : '';
  const border = isMatching ? 'border-yellow-400 bg-yellow-50' : 'border-green-800 bg-[#fefefe]';
  
  // Animation classes
  let animationClass = '';
  if (isMatching) {
    animationClass = 'animate-match';
  } else if (isInSlot) {
    animationClass = 'animate-pop-in';
  }

  return (
    <div
      onClick={() => isClickable && onClick(data)}
      style={{
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE + 4}px`, // +4 for the 3D depth
        ...positionStyle
      }}
      className={`
        ${animationClass}
        flex flex-col items-center justify-start
        rounded-lg border-2
        ${border}
        ${shadow}
        ${brightness}
        ${cursor}
        ${activeEffect}
        select-none
        transition-colors duration-200
      `}
    >
      <div className="flex items-center justify-center w-full h-[48px] text-3xl">
        {icon}
      </div>
    </div>
  );
};
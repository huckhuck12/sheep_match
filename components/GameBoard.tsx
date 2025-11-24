import React, { useMemo } from 'react';
import { TileData } from '../types';
import { Tile } from './Tile';
import { TILE_SIZE } from '../constants';

interface GameBoardProps {
  tiles: TileData[];
  onTileClick: (tile: TileData) => void;
  gridSize: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ tiles, onTileClick, gridSize }) => {
  
  // Calculate center offset to center the grid visually
  const boardSizePixel = gridSize * TILE_SIZE;
  
  return (
    <div 
      className="relative mx-auto transition-all duration-300"
      style={{
        width: `${boardSizePixel}px`,
        height: `${boardSizePixel}px`,
      }}
    >
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          data={tile}
          onClick={onTileClick}
        />
      ))}
    </div>
  );
};
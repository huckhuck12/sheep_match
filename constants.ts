import { TileType, LayoutPattern } from './types';

export const TILE_SIZE = 48; // Pixel size for calculation base (scaled in CSS)
export const TILE_GAP = 4;

export const TILE_ICONS: Record<TileType, string> = {
  [TileType.SHEEP]: '🐑',
  [TileType.CARROT]: '🥕',
  [TileType.FIRE]: '🔥',
  [TileType.STUMP]: '🪵',
  [TileType.WOOL]: '🧶',
  [TileType.GRASS]: '☘️',
  [TileType.BUCKET]: '🪣',
  [TileType.CORN]: '🌽',
  [TileType.BRUSH]: '🧹',
  [TileType.MILK]: '🥛',
};

export const MAX_SLOTS = 7;
export const LEVEL_CONFIG = {
  EASY: { 
    gridSize: 6, 
    totalTiles: 24, 
    typesCount: 4, 
    layoutPattern: LayoutPattern.GRID_SCATTER 
  },
  HARD: { 
    gridSize: 8, 
    totalTiles: 120, 
    typesCount: 10, 
    layoutPattern: LayoutPattern.RANDOM_LAYERED 
  }, 
};

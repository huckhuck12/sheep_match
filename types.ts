export enum TileType {
  SHEEP = 'SHEEP',
  CARROT = 'CARROT',
  FIRE = 'FIRE',
  STUMP = 'STUMP',
  WOOL = 'WOOL',
  GRASS = 'GRASS',
  BUCKET = 'BUCKET',
  CORN = 'CORN',
  BRUSH = 'BRUSH',
  MILK = 'MILK'
}

export interface TileData {
  id: string;
  type: TileType;
  layer: number;
  x: number; // Grid units
  y: number; // Grid units
  isClickable: boolean;
  zIndex: number;
}

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  WON = 'WON',
  LOST = 'LOST'
}

export enum LayoutPattern {
  RANDOM_LAYERED = 'RANDOM_LAYERED',
  GRID_SCATTER = 'GRID_SCATTER',
  SPIRAL_TOWER = 'SPIRAL_TOWER'
}

export interface LevelConfig {
  gridSize: number; // e.g., 8x8
  totalTiles: number; // Must be divisible by 3
  typesCount: number; // How many unique types to include
  layoutPattern: LayoutPattern;
}
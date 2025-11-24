import { TileData, TileType, LevelConfig, LayoutPattern } from '../types';

// Generate a unique ID
const uuid = () => Math.random().toString(36).substring(2, 9);

// 1. Logic to create the deck of cards (ensure triplets)
const createTileDeck = (totalTiles: number, typesCount: number): TileType[] => {
  const allTypes = Object.values(TileType);
  const activeTypes = allTypes.slice(0, typesCount);
  
  // We need totalTiles to be divisible by 3
  const tripletsCount = Math.floor(totalTiles / 3);
  const tilePool: TileType[] = [];
  
  for (let i = 0; i < tripletsCount; i++) {
    const type = activeTypes[i % activeTypes.length];
    tilePool.push(type, type, type);
  }

  // Shuffle pool
  for (let i = tilePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tilePool[i], tilePool[j]] = [tilePool[j], tilePool[i]];
  }
  
  return tilePool;
};

// 2. Layout Strategies
type LayoutFunction = (deck: TileType[], gridSize: number) => TileData[];

const Layouts: Record<LayoutPattern, LayoutFunction> = {
  [LayoutPattern.RANDOM_LAYERED]: (deck, gridSize) => {
    // The "Classic" Sheep a Sheep style
    // Base layer scattered, upper layers clustered in center
    const center = gridSize / 2;
    const totalTiles = deck.length;

    return deck.map((type, index) => {
      let layer = 0;
      let x = 0;
      let y = 0;

      const normalizedIndex = index / totalTiles; 
      
      if (normalizedIndex < 0.3) {
        // Base layer, spread out
        layer = 0;
        x = Math.floor(Math.random() * (gridSize - 2)) + 1;
        y = Math.floor(Math.random() * (gridSize - 2)) + 1;
      } else {
        // Upper layers, concentrated in center with random offsets
        layer = Math.floor(normalizedIndex * 12); 
        
        const offsetRange = Math.max(0.5, 3 - layer * 0.25); 
        
        const rx = (Math.random() - 0.5) * 2 * offsetRange;
        const ry = (Math.random() - 0.5) * 2 * offsetRange;
        
        x = center - 0.5 + rx; 
        y = center - 0.5 + ry;
        
        // Snap to 0.5 grid for clean overlaps
        x = Math.round(x * 2) / 2;
        y = Math.round(y * 2) / 2;
      }

      // Ensure bounds
      x = Math.max(0, Math.min(gridSize - 1, x));
      y = Math.max(0, Math.min(gridSize - 1, y));

      return {
        id: uuid(),
        type,
        layer,
        x,
        y,
        isClickable: false, // Calculated later
        zIndex: layer * 100 + index
      };
    });
  },

  [LayoutPattern.GRID_SCATTER]: (deck, gridSize) => {
    // Easier pattern: Flatter, grid-aligned, less overlap
    return deck.map((type, index) => {
      // Create a few broad layers
      const itemsPerLayer = Math.floor((gridSize - 1) * (gridSize - 1)); 
      const layer = Math.floor(index / itemsPerLayer);
      
      // Calculate grid position
      const posIndex = index % itemsPerLayer;
      const rowSize = Math.floor(Math.sqrt(itemsPerLayer));
      
      let x = 1 + (posIndex % rowSize);
      let y = 1 + Math.floor(posIndex / rowSize);

      // Add jitter so it's not a boring perfect grid
      x += (Math.random() - 0.5) * 0.4;
      y += (Math.random() - 0.5) * 0.4;

      return {
        id: uuid(),
        type,
        layer,
        x,
        y,
        isClickable: false,
        zIndex: layer * 100 + index
      };
    });
  },

  [LayoutPattern.SPIRAL_TOWER]: (deck, gridSize) => {
    // Experimental: A spiral tower climbing upwards
    const center = gridSize / 2 - 0.5;
    return deck.map((type, index) => {
      const angle = index * 0.4; // tightness of spiral
      const maxRadius = gridSize / 2 - 1;
      // Radius shrinks as we go up (higher index -> higher layer)
      const inverseProgress = 1 - (index / deck.length);
      const radius = maxRadius * inverseProgress;

      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      const layer = Math.floor(index / 6); // New layer every 6 items

      return {
        id: uuid(),
        type,
        layer,
        x,
        y,
        isClickable: false,
        zIndex: layer * 100 + index
      };
    });
  }
};


export const generateLevel = (config: LevelConfig): TileData[] => {
  const { totalTiles, typesCount, gridSize, layoutPattern } = config;
  
  // 1. Generate Deck
  const deck = createTileDeck(totalTiles, typesCount);

  // 2. Apply Layout Strategy
  const strategy = Layouts[layoutPattern] || Layouts[LayoutPattern.RANDOM_LAYERED];
  const tiles = strategy(deck, gridSize);

  // 3. Sort by layer (drawing order)
  tiles.sort((a, b) => a.layer - b.layer || a.zIndex - b.zIndex);
  
  return updateClickability(tiles);
};

// Check if Tile A covers Tile B
// Tiles cover if they intersect and A is on a higher layer (visually on top)
export const isCovered = (target: TileData, allTiles: TileData[]): boolean => {
  // Tile size is technically 1x1 in our grid logic
  // 0.92 ensures that even small overlaps block the card below
  const TR = 0.92; 
  
  for (const other of allTiles) {
    if (other.id === target.id) continue;

    // Use zIndex (visual render order) instead of just logical 'layer'.
    // If 'other' has a higher or equal zIndex, it MIGHT be on top.
    // However, our zIndices are unique (layer * 100 + index), so equal check is technically just for safety.
    // We only care if 'other' is strictly above 'target'.
    if (other.zIndex <= target.zIndex) continue;

    // Check intersection
    // |x1 - x2| < width && |y1 - y2| < height
    const xDist = Math.abs(other.x - target.x);
    const yDist = Math.abs(other.y - target.y);
    
    if (xDist < TR && yDist < TR) {
      return true;
    }
  }
  return false;
};

export const updateClickability = (tiles: TileData[]): TileData[] => {
  return tiles.map(tile => ({
    ...tile,
    isClickable: !isCovered(tile, tiles)
  }));
};

import {
  Vector3,
  Scene,
} from 'babylonjs';

import Game from './Game';
import Settings from './Utils/Settings';

import Hexagon from './Math/Hexagon';
import Tile from './Entities/Tile';
import Environment from './Entities/Environment';

export default class GameWorld {

  public static TREES = ['oak-1', 'oak-2', 'oak-3', 'oak-4', 'cacti-1', 'cacti-2', 'pine-1', 'pine-2', 'pine-3', 'pine-4', 'pine-5', 'snow-pine-1', 'snow-pine-2', 'snow-pine-3', 'snow-pine-4', 'snow-pine-5',];

  constructor(
    public game: Game,
    public settings?: Settings,
    public tiles?: Map<number, Tile>,
  ) {
    this.settings = settings || new Settings();
    this.tiles = tiles || new Map<number, Tile>();
    if (!tiles)
      this.generate();
  }

  public generate(): GameWorld {
    this.tiles.clear();
    this.createTiles(this.settings.size);
    return this;
  }

  //------------------------------------------------------------------------------------
  // LOCAL STORAGE
  //------------------------------------------------------------------------------------

  public load() {
    const json = JSON.parse(localStorage.getItem('world') || 'null');
    if (!json) return false;

    this.settings = Settings.fromJSON(json.settings);
    this.tiles.clear();
    json.tiles.map((entry: { hash: number, tile: Tile }) => {
      this.tiles.set(entry.hash, Tile.fromJSON(entry.tile));
    });
    return true;
  }

  public store() {
    let tiles = [];
    this.tiles.forEach((tile: Tile, hash: number) => {
      tiles.push({ hash: hash, tile: tile });
    });
    localStorage.setItem('world', JSON.stringify({
      settings: this.settings,
      tiles: tiles,
    }));
  }

  //------------------------------------------------------------------------------------
  // TILE GENERATION
  //------------------------------------------------------------------------------------

  private createTiles(mapRadius: number): void {
    for (let q = -mapRadius; q <= mapRadius; q++) {
      const r1 = Math.max(-mapRadius, -q - mapRadius);
      const r2 = Math.min(mapRadius, -q + mapRadius);
      for (let r = r1; r <= r2; r++) {
        const hex = new Hexagon(q, r, -q - r);
        const hash = hex.hash();
        const tile = new Tile(hex, this.generateTileType(hash, [
          this.tiles.get(hex.neighbor(3).hash()),
          this.tiles.get(hex.neighbor(4).hash()),
          this.tiles.get(hex.neighbor(5).hash()),
        ]));

        /* Environment */
        switch (tile.type) {
          case 'mountain':
            tile.surface = Tile.SURFACE.MOUNTAIN;
            break;

          case 'plain':
            tile.surface = Tile.SURFACE.GRASS;
            break;

          case 'desert':
            tile.surface = Tile.SURFACE.DUNES;
            break;

          case 'ocean':
            tile.surface = Tile.SURFACE.OCEAN;
            break;

          case 'forest':
            this.createForest(tile);
            break;
        }

        this.tiles.set(hash, tile);
      }
    }
  }

  private generateTileType(hash: number, neighbors: Tile[]): string {
    const probability = {};
    for (let key in Tile.TYPE) probability[Tile.TYPE[key]] = 1;

    /* Affect probability of tile type based on neighboring tiles */
    for (var i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (typeof neighbor === 'undefined')
        continue;

      switch (neighbor.type) {
        case 'mountain':
          if (probability[Tile.TYPE.MOUNTAIN] < 4)
            probability[Tile.TYPE.MOUNTAIN] = 10;
          else
            probability[Tile.TYPE.MOUNTAIN] -= 6;
          break;

        case 'plain':
          probability[Tile.TYPE.PLAIN] += 5;
          break;

        case 'desert':
          probability[Tile.TYPE.DESERT] += 5;
          break;

        case 'forest':
          probability[Tile.TYPE.FOREST] += 5;
          break;

        case 'ocean':
          probability[Tile.TYPE.OCEAN] *= 3;
          break;

        default:
          probability[neighbor.type] += 1;
      }
    }

    let sum = 0;
    for (let key in probability) sum += probability[key];
    let selection = Math.abs(this.settings.seed.random() * hash * 100 % sum) << 0;

    for (let key in probability) {
      selection -= probability[key];
      if (selection < 0)
        return key;
    }
  }

  //------------------------------------------------------------------------------------
  // TILE ENVIRONMENT GENERATION
  //------------------------------------------------------------------------------------

  private createForest(tile: Tile) {
    tile.biomeData.density = 0.2;
    tile.biomeData.treeType = GameWorld.TREES.random(
      this.settings.seed.random() * tile.hexagon.hash() * 100
    );

    const forest = [];
    for (let i = 0; i < 500; ++i) {
      let position = this.settings.layout.randomInside(tile.hexagon, 0);
      let reject = false;
      for (let ii = 0; ii < forest.length; ++ii) {
        if (Vector3.Distance(forest[ii].position, position) < 0.2 * (1 - tile.biomeData.density)) {
          reject = true;
          break;
        }
      }

      if (reject)
        continue;

      const tree = new Environment('tree', `${tile.biomeData.treeType}`);
      tree.position = position;
      forest.push(tree);
    }
    tile.addEnvironment(forest);
  }
}
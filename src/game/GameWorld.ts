import {
  Vector3,
  Scene,
} from 'babylonjs';
import Game from './Game';
import Hexagon from './Math/Hexagon';
import Tile from './Logic/Tile';
import Settings from './Logic/Settings';
import Entity from './Entities/Entity';
import Environment from './Entities/Environment';
import Structure from './Entities/Structure';

export default class GameWorld {

  public static TREES = ['oak-1','oak-2','oak-3','oak-4', 'cacti-1','cacti-2', 'pine-1','pine-2','pine-3','pine-4','pine-5', 'snow-pine-1','snow-pine-2','snow-pine-3','snow-pine-4','snow-pine-5',];

  public tiles: Map<number, Tile>;

  constructor(
    public game: Game
  ) {
    this.tiles = new Map<number, Tile>();
    if (this.game.settings.seed)
      this.generate();
  }

  public generate(): GameWorld {
    this.tiles.clear();
    this.createTiles(this.game.settings.world.size);
    return this;
  }

  //------------------------------------------------------------------------------------
  // TILE GENERATION
  //------------------------------------------------------------------------------------

  private createTiles(mapRadius: number): void {
    for (let q = -mapRadius; q <= mapRadius; q++) {
      const r1 = Math.max(-mapRadius, -q - mapRadius);
      const r2 = Math.min(mapRadius, -q + mapRadius);
      for (let r = r1; r <= r2; r++) {
        const hex = new Hexagon(q, r, -q-r);
        const hash = hex.hash();
        const tile = new Tile(hex, this.generateTileType(hash, [
          this.tiles.get(hex.neighbor(3).hash()),
          this.tiles.get(hex.neighbor(4).hash()),
          this.tiles.get(hex.neighbor(5).hash()),
        ]));

        /* Environment */
        switch (tile.type) {
          case 'mountain':
            tile.surface = Tile.SURFACES.MOUNTAIN;
            break;

          case 'plain':
            //tile.surface = Tile.SURFACES.GRASS;
            break;

          case 'desert':
            //tile.surface = Tile.SURFACES.DUNES;
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
    for(let key in Tile.TYPES) probability[Tile.TYPES[key]] = 1;

    /* Affect probability of tile type based on neighboring tiles */
    for (var i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (typeof neighbor === 'undefined')
        continue;

      switch (neighbor.type) {
        case 'mountain':
          if (probability[Tile.TYPES.MOUNTAIN] < 4)
            probability[Tile.TYPES.MOUNTAIN] = 10;
          else
            probability[Tile.TYPES.MOUNTAIN] -= 6;
          break;

        case 'plain':
          probability[Tile.TYPES.PLAIN] += 5;
          break;

        case 'desert':
          probability[Tile.TYPES.DESERT] += 5;
          break;

        case 'forest':
          probability[Tile.TYPES.FOREST] += 5;
          break;

        case 'ocean':
          probability[Tile.TYPES.OCEAN] *= 3;
          break;

        default:
          probability[neighbor.type] += 1;
      }
    }

    let sum = 0;
    for(let key in probability) sum += probability[key];
    let selection = Math.abs(this.game.settings.seed.random() * hash * 100 % sum) << 0;

    for(let key in probability) {
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
      this.game.settings.seed.random() * tile.hexagon.hash() * 100
    );

    const tilePosition = this.game.settings.world.layout.hexagonToPixel(tile.hexagon, 0);
    const forest = [];
    for (let i = 0; i < 500; ++i) {
      let position = tilePosition.add(this.game.settings.world.layout.randomInside(tile.hexagon, 0));
      let reject = false;
      for (let ii = 0; ii < forest.length; ++ii) {
        if (Vector3.Distance(forest[ii].position, position) < 0.2 * (1 - tile.biomeData.density)) {
          reject = true;
          break;
        }
      }

      if (reject)
        continue;

      const tree = new Environment('tree', tile, `${tile.biomeData.treeType}`);
      tree.position = position;
      forest.push(tree);
    }
    tile.addEnvironment(forest);
  }
}
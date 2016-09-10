import {
  Scene,
  Vector2, Vector3,
} from 'babylonjs';
import Game from './Game';
import Hexagon from './Math/Hexagon';
import { HexagonLayout } from './Math/HexagonLayout';
import Tile from './Entities/Tile';
import Environment from './Entities/Environment';
import Player from './Actors/Player';
import PlayerManager from './Managers/PlayerManager';

export default class GameWorld {

  public tiles: Map<number, Tile>;
  public layout: HexagonLayout;

  private playerManager: PlayerManager;

  constructor(
    private game: Game,
    private scene: Scene
  ) {
    /* Scene */
    this.scene.collisionsEnabled = false;

    /* Managers */
    this.playerManager = new PlayerManager(this.scene);

    /* Tiles */
    this.tiles = new Map<number, Tile>();
    this.layout = new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL,
      new Vector2(0.5, 0.5),
      new Vector3(0, 0, 0)
    );
    this.createTiles(5, 5);
  }

  onCreate() {
    const player = this.playerManager.add('TestMan', Player.TYPES.LOCAL);
    player.createBase(this.tiles.get(new Hexagon(0,0,0).hash()));
    console.log(player);
    this.onUpdate();
  }

  onResume() {
    this.onUpdate();
  }

  onUpdate() {

  }

  onPause () {
    
  }

  onDestroy () {

  }

  private createTiles(mapRadius: number, visibilityRadius: number): void {
    const viewPoint = new Hexagon(0,0,0);

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

        /* Visibility */
        if (tile.hexagon.distance(viewPoint) <= visibilityRadius)
          tile.explored = true;

        /* Environment */
        switch (tile.type) {
          case 'mountain':
            this.createMountains(tile);
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
  // TILE ENVIRONMENT CREATION
  //------------------------------------------------------------------------------------

  private createForest(tile: Tile) {
    tile.biomeData.density = 0.2;
    tile.biomeData.treeType = ['pine', 'oak', 'birch'].random(
      this.game.settings.seed.random() * tile.hexagon.hash() * 100
    );

    const tilePosition = this.layout.hexagonToPixel(tile.hexagon, 0);
    const forest = [];
    for (let i = 0; i < 500; ++i) {
      let position = tilePosition.add(this.layout.randomInside(tile.hexagon, 0));
      let reject = false;
      for (let ii = 0; ii < forest.length; ++ii) {
        if (Vector3.Distance(forest[ii].position, position) < 0.2 * (1 - tile.biomeData.density)) {
          reject = true;
          break;
        }
      }

      if (reject)
        continue;

      const tree = new Environment('tree', `${tile.biomeData.treeType}-tree`);
      tree.position = position;
      forest.push(tree);
    }
    tile.addEnvironment(forest);
  }

  private createMountains(tile: Tile) {
    tile.biomeData.height = 1;

    const tilePosition = this.layout.hexagonToPixel(tile.hexagon, 0);
    const mountains = [];
    let mountain = new Environment('mountain');
    mountain.position = tilePosition;
    mountains.push(mountain);

    /*
    for (let i = 0; i < 500; ++i) {
      let position = tilePosition.add(this.layout.randomInside(tile.hexagon, 0));
      let reject = false;
      for (let ii = 0; ii < forest.length; ++ii) {
        if (Vector3.Distance(forest[ii].position, position) < 0.2 * (1 - tile.biomeData.density)) {
          reject = true;
          break;
        }
      }

      if (reject)
        continue;

      const tree = new Entity('tree', `${tile.biomeData.treeType}-tree`);
      tree.position = position;
      forest.push(tree);
    }
    */
    //tile.addEnvironment(mountains);
  }
}
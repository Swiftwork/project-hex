import {
  Scene,
  Vector2, Vector3,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import Hexagon from './Math/Hexagon';
import HexagonLayout from './Math/HexagonLayout';
import PriorityQueue from './Lib/PriorityQueue';
import Tile from './Entities/Tile';
import Structure from './Entities/Structure';
import Unit from './Entities/Unit';
import Player from './Actors/Player';
import PlayerManager from './Managers/PlayerManager';

export default class GameLogic {

  constructor(
    private game: Game,
    private world: GameWorld
  ) {
    /* Scene */
    this.game.scene.collisionsEnabled = false;
  }

  onCreate() {
    const player = this.game.playerManager.add('TestMan', Player.TYPES.LOCAL);

    const base1 = player.createBase(this.world.tiles.get(new Hexagon(-3, 5, -2).hash()));
    const base2 = player.createBase(this.world.tiles.get(new Hexagon(5, 3, -8).hash()));
    const base3 = player.createBase(this.world.tiles.get(new Hexagon(-5, -6, 11).hash()));
    base1.position = Vector3.Zero();
    base2.position = Vector3.Zero();
    base3.position = Vector3.Zero();

    const scout1 = player.createScout(this.world.tiles.get(new Hexagon(0, 0, 0).hash()));
    scout1.position = Vector3.Zero();

    this.onUpdate();
  }

  onResume() {
    this.onUpdate();
  }

  onUpdate() {
    this.updateVisiblity();
  }

  onPause() {

  }

  onDestroy() {

  }

  //------------------------------------------------------------------------------------
  // VISIBILITY
  //------------------------------------------------------------------------------------

  private updateVisiblity() {
    const player = this.game.playerManager.getLocal();
    const playerOwned = player.structures.concat(<any>player.units);

    /* Reset Visibility */
    this.world.tiles.forEach((tile: Tile) => {
      tile.isVisible = false;
    });

    /* Visible Tiles */
    playerOwned.forEach((entity: Structure | Unit) => {
      const source = this.world.tiles.get(entity.tileId);
      const sight = source.structure ? source.structure.sight : source.unit.sight;
      const maxSight = sight + 3;

      let circumference = []
      let hexagon = Hexagon.Zero().neighbor(4).scale(maxSight).add(source.hexagon);
      for (var i = 0; i < 6; i++) {
        for (var ii = 0; ii < maxSight; ii++) {
          circumference.push(hexagon)
          let tile = this.world.tiles.get(hexagon.hash());
          hexagon = hexagon.neighbor(i);
        }
      }

      circumference.forEach((hexagon: Hexagon) => {
        const distance = source.hexagon.distance(hexagon);
        const step = (1 / distance)
        let los = sight;
        for (var i = 0; i < distance; i++) {
          let tile = this.world.tiles.get(source.hexagon.lerp(hexagon, step * i).hash());
          if (!tile) continue;

          if (0 < los + 1)
            tile.isExplored = true;

          if (0 < los)
            tile.isVisible = true;

          if (tile.biomeData.occultation)
            los -= tile.biomeData.occultation;
          else
            los--;
        }
      });
    });
  }

  //------------------------------------------------------------------------------------
  // HELPERS
  //------------------------------------------------------------------------------------

  public getReachable2(origin: Tile, movement: number): Set<Tile> {
    let reachable = new Set<Tile>();
    reachable.add(origin);
    let fringes: [Tile[]] = [[origin]];

    for (var i = 0; i < movement; i++) {
      fringes.push([]);
      fringes[i - 1].forEach((tile: Tile) => {
        for (var ii = 0; ii < 6; ii++) {
          let neighbor = <Tile>this.world.tiles.get(tile.hexagon.neighbor(ii).hash());
          if (neighbor && !reachable.has(neighbor)) continue;
          //if (!neighbor.biomeData.impassable) continue;
          if (neighbor.structure || neighbor.unit) continue;
          reachable.add(neighbor);
        }
      });
    }
    return reachable;
  }

  public getReachable(origin: Tile, limit: number) {
    let frontier = new PriorityQueue<{ tile: Tile, cost: number }>((a, b) => a.cost < b.cost);
    frontier.add({ tile: origin, cost: 0 });

    let history = new Map<Tile, number>();
    history.set(origin, 0);

    while (!frontier.isEmpty()) {
      let current = frontier.poll();

      for (let i = 0; i < 6; i++) {
        let next = this.world.tiles.get(current.tile.hexagon.neighbor(i).hash());
        let cost = history.get(current.tile) + (next.biomeData.mobility || 1);

        if (cost > limit)
          continue;

        if (!history.has(next) || cost < history.get(next)) {
          history.set(next, cost);
          frontier.add({ tile: next, cost: cost });
        }
      }
    }

    return Array.from(history.keys());
  }

  public getPath(origin: Tile, goal: Tile) {
    let frontier = new PriorityQueue<{ tile: Tile, cost: number }>((a, b) => a.cost < b.cost);
    frontier.add({ tile: origin, cost: 0 });

    let history = new Map<Tile, { previous: Tile, cost: number }>();
    history.set(origin, { previous: null, cost: 0 });

    while (!frontier.isEmpty()) {
      let current = frontier.poll();

      if (goal && current.tile === goal)
        break;

      for (let i = 0; i < 6; i++) {
        let next = this.world.tiles.get(current.tile.hexagon.neighbor(i).hash());
        let cost = history.get(current.tile).cost + (next.biomeData.mobility || 1);

        if (!history.has(next) || cost < history.get(next).cost) {
          history.set(next, { previous: current.tile, cost: cost });
          frontier.add({ tile: next, cost: cost });
        }
      }
    }

    let current = goal;
    let path: Tile[] = [current];
    while (current !== origin) {
      path.push(current = history.get(current).previous);
    }
    path = path.reverse();
    return path;
  }
}
import {
  Scene,
  Vector2, Vector3,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import Hexagon from './Math/Hexagon';
import HexagonLayout from './Math/HexagonLayout';
import Tile from './Entities/Tile';
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

    const base1 = player.createBase(this.world.tiles.get(new Hexagon(0, 0, 0).hash()));
    const base2 = player.createBase(this.world.tiles.get(new Hexagon(5, 3, -8).hash()));
    const base3 = player.createBase(this.world.tiles.get(new Hexagon(-5, -6, 11).hash()));
    base1.position = Vector3.Zero();
    base2.position = Vector3.Zero();
    base3.position = Vector3.Zero();

    const scout1 = player.createScout(this.world.tiles.get(new Hexagon(-3, 5, -2).hash()));
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
    const structuresUnts = player.structures.concat(<any>player.units);
    this.world.tiles.forEach((tile: Tile) => {
      tile.isVisible = false;

      for (let i = 0; i < structuresUnts.length; i++) {
        const entity = structuresUnts[i];
        //const distance = tile.hexagon.distance(entity.tile.hexagon);
        const distance = 0;

        if (distance <= 3) {
          tile.isExplored = true;
        }

        if (distance <= entity.visibility) {
          tile.isVisible = true;
          return;
        }
      }
    });
  }
}
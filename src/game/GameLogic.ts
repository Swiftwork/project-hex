import {
  Scene,
  Vector2, Vector3,
} from 'babylonjs';
import Game from './Game';
import GameWorld from './GameWorld';
import Hexagon from './Math/Hexagon';
import HexagonLayout from './Math/HexagonLayout';
import Tile from './Logic/Tile';
import Entity from './Entities/Entity';
import Environment from './Entities/Environment';
import Structure from './Entities/Structure';
import Player from './Actors/Player';
import PlayerManager from './Managers/PlayerManager';

export default class GameLogic {

  constructor(
    private game: Game,
    private world: GameWorld,
    private scene: Scene
  ) {
    /* Scene */
    this.scene.collisionsEnabled = false;
  }

  onCreate() {
    const player = this.game.playerManager.add('TestMan', Player.TYPES.LOCAL);

    const base1 = player.createBase(this.world.tiles.get(new Hexagon(0,0,0).hash()));
    const base2 = player.createBase(this.world.tiles.get(new Hexagon(5,3,-8).hash()));
    const base3 = player.createBase(this.world.tiles.get(new Hexagon(-5,-6,11).hash()));
    base1.tile.structure.position = this.game.settings.world.layout.hexagonToPixel(base1.tile.hexagon, 0);
    base2.tile.structure.position = this.game.settings.world.layout.hexagonToPixel(base2.tile.hexagon, 0);
    base3.tile.structure.position = this.game.settings.world.layout.hexagonToPixel(base3.tile.hexagon, 0);

    const scout1 = player.createScout(this.world.tiles.get(new Hexagon(-3,5,-2).hash()));
    scout1.tile.unit.position = this.game.settings.world.layout.hexagonToPixel(scout1.tile.hexagon, 0);

    this.onUpdate();
  }

  onResume() {
    this.onUpdate();
  }

  onUpdate() {
    this.updateVisiblity();
  }

  onPause () {
    
  }

  onDestroy () {

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
        const distance = tile.hexagon.distance(entity.tile.hexagon);

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
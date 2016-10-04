import {
  Engine, Scene, ScreenSpaceCanvas2D,
} from 'babylonjs';

import Game, { IGameFlow } from '../Game';
import Settings from '../Logic/Settings';

export default class Screen implements IGameFlow {

  constructor(public game: Game) {
  }

  onCreate() {
    this.game.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onResume() {
    this.game.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onUpdate() {
  }

  onResize() {
  }

  onPause() {
  }

  onDestroy() {
  }
}
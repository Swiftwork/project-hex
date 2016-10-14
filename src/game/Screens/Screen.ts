import {
  Engine, Scene, Size,
} from 'babylonjs';

import {
  ScreenSpaceCanvas2D, Rectangle2D, Canvas2D,
} from 'babylonjs/babylon.canvas2d';

import Game, { IGameFlow } from '../Game';
import Settings from '../Utils/Settings';

export default class Screen implements IGameFlow {

  public screen: Rectangle2D;
  public created: boolean;

  constructor(public game: Game, public id: string) {
    this.screen = new Rectangle2D({
      id: this.id,
      parent: this.game.scene2d,
      marginAlignment: 'v: stretch, h: stretch',
    });
  }

  onCreate() {
    this.screen.levelVisible = true;
    this.created = true;
  }

  onResume() {
  }

  onUpdate() {
  }

  onResize() {
  }

  onPause() {
  }

  onDestroy() {
    this.screen.dispose();
  }
}
import {
  Engine, Scene, Size,
  ScreenSpaceCanvas2D, Rectangle2D, Canvas2D, Group2D,
} from 'babylonjs';

import Game, { IGameFlow } from '../Game';
import Settings from '../Utils/Settings';

export default class Screen implements IGameFlow {

  public screen: Group2D;
  public created: boolean;

  constructor(public game: Game, public id: string) {
    this.screen = new Group2D({
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
import Game, { IGameFlow } from '../Game';
import { StackPanel } from 'babylonjs-gui';

export default class Screen implements IGameFlow {

  public screen: StackPanel;
  public created: boolean;

  constructor(public game: Game, public id: string) {
    this.screen = new StackPanel(this.id);
    /*  
    {
      id: this.id,
      parent: this.game.scene2d,
      marginAlignment: 'v: stretch, h: stretch',
    });
    */
  }

  onCreate() {
    //this.screen.levelVisible = true;
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

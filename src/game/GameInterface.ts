import {
  Vector2, Vector3, Color3, Color4, Size,
  Scene, ScreenSpaceCanvas2D,
  Text2D, Rectangle2D,
  ArcRotateCamera,
} from 'babylonjs';

import Game from './Game';
import Resource from './Logic/Resource';
import Label from './GUI/Label';

/* VIEWS */
import ResourceView from './GUI/ResourceView';
import CompassView from './GUI/CompassView';

export default class GameInterface {

  /* GENERAL */
  private mainCamera: ArcRotateCamera;

  /* VIEWS */
  private compass: CompassView;

  constructor(
    private game: Game,
    private scene: Scene
  ) {
    this.mainCamera = <ArcRotateCamera> this.game.cameraManager.get('main');

    this.compass = <CompassView> this.game.guiManager.add('compass',
      new CompassView('compass', this.game.gui, this.game.assetsManager.get('interface-compass')));
  }

  onCreate() {
    this.createTopBar();
    this.game.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onResume() {
    this.game.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onUpdate() {
    this.compass.sprite.rotation = -this.mainCamera.alpha;
  }

  onResize() {
    //this.gui.size.width = this.canvas.clientWidth * this.settings.graphics.dpr;
    //this.gui.size.height = this.canvas.clientHeight * this.settings.graphics.dpr;
  }

  onPause () {
  }

  onDestroy () {
  }

  //------------------------------------------------------------------------------------
  // INTERFACE GROUPS
  //------------------------------------------------------------------------------------

  private createTopBar() {
   const bar = new Rectangle2D({id: 'top-bar', parent: this.game.gui,
      y: this.game.gui.height - 100,
      width: this.game.gui.width,
      height: 100,
      fill: '#00000090',
    });

    const resourceView = new ResourceView('resource-view', this.game.gui);
    resourceView.addResource(new Resource('gold'), Label.ICON.GOLD, new Color4(0, 1, 1, 1));
  }

  //------------------------------------------------------------------------------------
  // HELPERS
  //------------------------------------------------------------------------------------
}
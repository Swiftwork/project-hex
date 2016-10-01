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
  private GUIWidth: number;
  private GUIHeight: number;

  /* VIEWS */
  private menu: Label;
  private clock: Label;
  private fps: Label;
  private compass: CompassView;
  private resources: ResourceView;

  constructor(
    private game: Game,
    private scene: Scene
  ) {
    this.mainCamera = <ArcRotateCamera> this.game.cameraManager.get('main');
    this.onResize();
  }

  onCreate() {
    this.createCompass();
    this.createTopBar();
    this.game.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onResume() {
    this.game.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onUpdate() {
    this.compass.sprite.rotation = -this.mainCamera.alpha;
    this.clock.setText(new Date().toLocaleTimeString('sv-SV'));
    this.fps.setText(`${Math.floor(this.game.engine.getFps()).toString()} fps`);
  }

  onResize() {
    this.GUIWidth = this.game.engine.getRenderWidth();
    this.GUIHeight = this.game.engine.getRenderHeight();
  }

  onPause () {
  }

  onDestroy () {
  }

  //------------------------------------------------------------------------------------
  // INTERFACE GROUPS
  //------------------------------------------------------------------------------------

  private createCompass() {
    this.compass = <CompassView> this.game.guiManager.add('compass',
      new CompassView('compass', this.game.gui, this.game.assetsManager.get('interface-compass')));
  }

  private createTopBar() {

    const bar = new Rectangle2D({id: 'top-bar', parent: this.game.gui,
      y: this.GUIHeight - 80,
      width: this.GUIWidth,
      height: 80,
      fill: '#000000ff',
    });

    this.resources = new ResourceView('resource-view', this.game.gui, {
      position: new Vector2(40, this.GUIHeight - (80 + 32) / 2),
      textSize: 32,
    });
    this.resources.addResource(new Resource('wood'), Label.ICON.LOG, new Color4(0.50, 0.38, 0.30, 1));
    this.resources.addResource(new Resource('stone'), Label.ICON.STONE, new Color4(0.70, 0.70, 0.70, 1));
    this.resources.addResource(new Resource('metal'), Label.ICON.GOLD, new Color4(0.95, 0.87, 0, 1));
    this.resources.addResource(new Resource('food'), Label.ICON.STEAK, new Color4(0.95, 0.24, 0.32, 1));
    this.resources.addResource(new Resource('units'), Label.ICON.MAN, new Color4(0.22, 1, 0.26, 1));

    this.menu = new Label('menu', this.game.gui, {
      position: new Vector2(this.GUIWidth - 80, this.GUIHeight - (80 + 48) / 2),
      textSize: 48,
      icon: Label.ICON.MENU,
      click: (eventData, eventState) => {
        console.log(eventData);
      },
    });

    this.clock = new Label('clock', this.game.gui, {
      position: new Vector2(this.GUIWidth - 300, this.GUIHeight - (80 + 32) / 2),
      text: new Date().toLocaleTimeString('sv-SV'),
      textSize: 32,
    });

    this.fps = new Label('fps', this.game.gui, {
      position: new Vector2(this.GUIWidth - 480, this.GUIHeight - (80 + 32) / 2),
      text: `${Math.floor(this.game.engine.getFps()).toString()} fps`,
      textSize: 32,
    });
  }

  //------------------------------------------------------------------------------------
  // HELPERS
  //------------------------------------------------------------------------------------
}
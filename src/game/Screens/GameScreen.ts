import {
  Vector2, Vector3, Color3, Color4, Size,
  Scene, ScreenSpaceCanvas2D,
  Text2D, Rectangle2D,
  ArcRotateCamera,
} from 'babylonjs';

import Game from '../Game';
import Settings from '../Logic/Settings';
import Resource from '../Logic/Resource';
import Screen from './Screen';

/* GAME */
import GameWorld from '../GameWorld';
import GameLogic from '../GameLogic';
import GameRenderer from '../GameRenderer';

/* INTERFACE */
import Label2D from '../Views/Label2D';
import Label from '../Views/LabelView';
import ResourceView from '../Views/ResourceView';
import CompassView from '../Views/CompassView';

export default class GameScreen extends Screen {

  /* GENERAL */
  private GUIWidth: number;
  private GUIHeight: number;
  private mainCamera: ArcRotateCamera;

  /* WORLD */
  public world: GameWorld;
  public logic: GameLogic;
  public renderer: GameRenderer;

  /* INTERFACE */
  private menu: Label;
  private clock: Label;
  private fps: Label;
  private compass: CompassView;
  private resources: ResourceView;

  constructor(public game: Game) {
    super(game);
    this.mainCamera = <ArcRotateCamera> this.game.cameraManager.get('main');
    this.onResize();
  }

  onCreate() {
    /* World Creation */
    this.world = new GameWorld(this.game);
    this.logic = new GameLogic(this.game, this.world);
    this.renderer = new GameRenderer(this.game, this.world);

    this.logic.onCreate();
    this.renderer.onCreate();

    /* Interface Creation */
    this.createCompass();
    this.createTopBar();
    super.onCreate();
  }

  onUpdate() {
    this.compass.sprite.rotation = -this.mainCamera.alpha;
    this.clock.setText(new Date().toLocaleTimeString('sv-SV'));
    this.fps.setText(`${Math.floor(this.game.engine.getFps()).toString()} fps`);
  }

  onResize() {
  }

  onResume() {
    this.logic.onResume();
    this.renderer.onResume();
  }

  onPause() {
    this.logic.onPause();
    this.renderer.onPause();
  }

  onDestroy() {
    this.logic.onDestroy();
    this.renderer.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // INTERFACE CREATORS
  //------------------------------------------------------------------------------------

  private createCompass() {
    this.compass = <CompassView>this.game.viewManager.add('compass',
      new CompassView('compass', this.game.scene2d, this.game.assetManager.get('interface-compass')));
  }

  private createTopBar() {
    const bar = new Rectangle2D({
      id: 'top-bar', parent: this.game.scene2d,
      y: this.GUIHeight - 80,
      width: this.GUIWidth,
      height: 80,
      fill: '#000000ff',
    });

    this.resources = new ResourceView('resource-view', this.game.scene2d, {
      position: new Vector2(40, this.GUIHeight - (80 + 32) / 2),
      textSize: 32,
    });
    this.resources.addResource(new Resource('wood'), Label.ICON.LOG, new Color4(0.50, 0.38, 0.30, 1));
    this.resources.addResource(new Resource('stone'), Label.ICON.STONE, new Color4(0.70, 0.70, 0.70, 1));
    this.resources.addResource(new Resource('metal'), Label.ICON.GOLD, new Color4(0.95, 0.87, 0, 1));
    this.resources.addResource(new Resource('food'), Label.ICON.STEAK, new Color4(0.95, 0.24, 0.32, 1));
    this.resources.addResource(new Resource('units'), Label.ICON.MAN, new Color4(0.22, 1, 0.26, 1));

    this.menu = new Label('menu', this.game.scene2d, {
      position: new Vector2(this.GUIWidth - 80, this.GUIHeight - (80 + 48) / 2),
      textSize: 48,
      icon: Label.ICON.MENU,
      click: (eventData, eventState) => {
        console.log(eventData);
      },
    });

    this.clock = new Label('clock', this.game.scene2d, {
      position: new Vector2(this.GUIWidth - 300, this.GUIHeight - (80 + 32) / 2),
      text: new Date().toLocaleTimeString('sv-SV'),
      textSize: 32,
    });

    this.fps = new Label('fps', this.game.scene2d, {
      position: new Vector2(this.GUIWidth - 480, this.GUIHeight - (80 + 32) / 2),
      text: `${Math.floor(this.game.engine.getFps()).toString()} fps`,
      textSize: 32,
    });
  }
}
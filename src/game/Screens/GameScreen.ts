import {
  Vector2, Vector3, Color3, Color4, Size,
  Scene, ScreenSpaceCanvas2D, PrimitiveAlignment,
  Text2D, Rectangle2D, Group2D, Canvas2D,
  Texture,
  ArcRotateCamera,
} from 'babylonjs';

import Game from '../Game';
import Settings from '../Utils/Settings';
import Resource from '../Logic/Resource';
import Screen from './Screen';

/* GAME */
import GameWorld from '../GameWorld';
import GameLogic from '../GameLogic';
import GameRenderer from '../GameRenderer';

/* INTERFACE */
import Label2D from '../Canvas2D/Label2D';
import Resources2D from '../Canvas2D/Resources2D';
import Compass2D from '../Canvas2D/Compass2D';

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
  private menu: Label2D;
  private clock: Label2D;
  private fps: Label2D;
  private compass: Compass2D;
  private resources: Resources2D;
  private statuses: Group2D;

  constructor(public game: Game, public id: string) {
    super(game, id);
    this.mainCamera = <ArcRotateCamera>this.game.cameraManager.get('main');
    this.onResize();
  }

  onCreate() {
    /* World Creation */
    this.world = new GameWorld(this.game);
    this.world.load();
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
    super.onUpdate();
    this.compass.rotation = -this.mainCamera.alpha;
    this.clock.text = new Date().toLocaleTimeString('sv-SV');
    this.fps.text = `${Math.floor(this.game.engine.getFps()).toString()} fps`;
  }

  onResize() {
    super.onResize();
    this.GUIWidth = this.game.engine.getRenderWidth();
    this.GUIHeight = this.game.engine.getRenderHeight();
  }

  onResume() {
    super.onResume();
    this.logic.onResume();
    this.renderer.onResume();
  }

  onPause() {
    this.logic.onPause();
    this.renderer.onPause();
    super.onPause();
  }

  onDestroy() {
    this.logic.onDestroy();
    this.renderer.onDestroy();
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // INTERFACE CREATORS
  //------------------------------------------------------------------------------------

  private createCompass() {
    const texture = <Texture>this.game.assetManager.get('interface-compass');
    texture.hasAlpha = true;

    this.compass = <Compass2D>this.game.canvas2DManager.add('compass',
      new Compass2D(texture, {
        id: 'compass',
        parent: this.screen,
        marginAlignment: 'v: top, h: right',
        marginTop: this.game.graphics.dpToPx(40),
      }));
  }

  private createTopBar() {
    const bar = new Rectangle2D({
      id: 'top-bar',
      parent: this.screen,
      marginAlignment: 'v: top, h: stretch',
      height: this.game.graphics.dpToPx(40),
      fill: Canvas2D.GetGradientColorBrush(new Color4(0, 0, 0, 0.5), new Color4(0, 0, 0, 0.7)),
    });

    this.resources = new Resources2D({
      id: 'resources',
      parent: this.screen,
      marginAlignment: 'v: top, h: left',
      marginTop: this.game.graphics.dpToPx(10),
      fontName: `${this.game.graphics.dpToPx(20)}px outage`,
    });
    this.resources.addResource(new Resource('wood'), Label2D.ICON.LOG, new Color4(0.50, 0.38, 0.30, 1));
    this.resources.addResource(new Resource('stone'), Label2D.ICON.STONE, new Color4(0.70, 0.70, 0.70, 1));
    this.resources.addResource(new Resource('metal'), Label2D.ICON.GOLD, new Color4(0.95, 0.87, 0, 1));
    this.resources.addResource(new Resource('food'), Label2D.ICON.STEAK, new Color4(0.95, 0.24, 0.32, 1));
    this.resources.addResource(new Resource('units'), Label2D.ICON.MAN, new Color4(0.22, 1, 0.26, 1));

    this.statuses = new Group2D({
      id: 'statuses',
      parent: this.screen,
      //size: new Size(this.game.graphics.dpToPx(310), this.game.graphics.dpToPx(20)),
      marginAlignment: 'v: top, h: right',
      marginTop: this.game.graphics.dpToPx(10),
      layoutEngine: 'Stackpanel',
    });

    this.fps = new Label2D(`${Math.floor(this.game.engine.getFps()).toString()} fps`, null, {
      id: 'fps',
      parent: this.statuses,
      fontName: `${this.game.graphics.dpToPx(20)}px outage`,
      marginLeft: this.game.graphics.dpToPx(32),
    });

    this.clock = new Label2D(new Date().toLocaleTimeString('sv-SV'), null, {
      id: 'clock',
      parent: this.statuses,
      fontName: `${this.game.graphics.dpToPx(20)}px outage`,
      marginLeft: this.game.graphics.dpToPx(32),
    });

    this.menu = new Label2D('', Label2D.ICON.MENU, {
      id: 'menu',
      parent: this.statuses,
      fontName: `${this.game.graphics.dpToPx(20)}px outage`,
      marginLeft: this.game.graphics.dpToPx(32),
    });
  }
}
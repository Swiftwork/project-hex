import Resource from '../Logic/Resource';
import { ArcRotateCamera, Texture, Color4 } from 'babylonjs';

import Game from '../Game';
import GameInput from '../GameInput';
import GameLogic from '../GameLogic';
import GameRenderer from '../GameRenderer';
import GameWorld from '../GameWorld';
import Chat from '../Gui/Chat';
import Compass from '../Gui/Compass';
import Label from '../Gui/Label';
import Resources from '../Gui/Resources';
import Screen from './Screen';
import { StackPanel, Control, Rectangle } from 'babylonjs-gui';

/* GAME */
/* INTERFACE */
export default class GameScreen extends Screen {

  /* GENERAL */
  private GUIWidth: number;
  private GUIHeight: number;
  private mainCamera: ArcRotateCamera;

  /* WORLD */
  public world: GameWorld;
  public logic: GameLogic;
  public renderer: GameRenderer;
  public input: GameInput;

  /* INTERFACE */
  private menu: Label;
  private clock: Label;
  private fps: Label;
  private compass: Compass;
  private resources: Resources;
  private statuses: StackPanel;
  private chat: Chat;

  constructor(public game: Game, public id: string) {
    super(game, id);
    this.mainCamera = <ArcRotateCamera>this.game.cameraManager.get('main');
    this.onResize();
  }

  onCreate() {
    /* World Creation */
    this.world = new GameWorld(this.game);
    this.world.store();
    this.logic = new GameLogic(this.game, this.world);
    this.input = new GameInput(this.game, this.logic, this.world);
    this.renderer = new GameRenderer(this.game, this.world, this.input);

    this.logic.onCreate();
    this.renderer.onCreate();

    /* Interface Creation */
    this.createCompass();
    this.createTopBar();
    this.createChat();

    this.input.onCreate();

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
    this.input.onResume();
  }

  onPause() {
    this.logic.onPause();
    this.renderer.onPause();
    this.input.onPause();
    super.onPause();
  }

  onDestroy() {
    this.logic.onDestroy();
    this.renderer.onDestroy();
    this.input.onDestroy();
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // INTERFACE CREATORS
  //------------------------------------------------------------------------------------

  private createCompass() {
    this.compass = <Compass>this.game.guiManager.add('compass', new Compass('compass'));
    this.compass.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.compass.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.compass.top = '96px';
    this.compass.onPointerDownObservable.add((eventData, eventState) => {
      this.mainCamera.alpha = 0;
    });
    this.game.textureGUI.addControl(this.compass);
  }

  private createTopBar() {
    const background = new Rectangle('topbar');
    background.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    background.width = '100%';
    background.height = '48px';
    background.thickness = 0;
    background.background = 'rgba(0, 0, 0, 0.5)';
    this.game.textureGUI.addControl(background);

    this.resources = new Resources('resources');
    this.resources.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.resources.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.resources.isVertical = false;
    this.game.textureGUI.addControl(this.resources);

    this.resources.addResource(new Resource('wood'), Label.ICON.LOG, new Color4(0.50, 0.38, 0.30, 1));
    this.resources.addResource(new Resource('stone'), Label.ICON.STONE, new Color4(0.70, 0.70, 0.70, 1));
    this.resources.addResource(new Resource('metal'), Label.ICON.GOLD, new Color4(0.95, 0.87, 0, 1));
    this.resources.addResource(new Resource('food'), Label.ICON.STEAK, new Color4(0.95, 0.24, 0.32, 1));
    this.resources.addResource(new Resource('units'), Label.ICON.MAN, new Color4(0.22, 1, 0.26, 1));

    this.statuses = new StackPanel('statuses');
    this.statuses.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.statuses.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.statuses.isVertical = false;
    this.statuses.color = "#ffffff"
    this.game.textureGUI.addControl(this.statuses);

    this.fps = new Label('fps', `${Math.floor(this.game.engine.getFps()).toString()} fps`);
    this.fps.width = '100px';
    this.fps.height = '48px';
    this.statuses.addControl(this.fps);

    this.clock = new Label('clock', new Date().toLocaleTimeString('sv-SV'));
    this.clock.width = '100px';
    this.clock.height = '48px';
    this.statuses.addControl(this.clock);

    this.menu = new Label('menu', '', Label.ICON.MENU);
    this.menu.width = '48px';
    this.menu.height = '48px';
    this.statuses.addControl(this.menu);
  }

  private createChat() {
    /*
    const background = new Rectangle2D({
      id: 'chat-background',
      parent: this.screen,
      size: new Size(this.game.graphics.dpToPx(480), this.game.graphics.dpToPx(240)),
      fill: Canvas2D.GetSolidColorBrush(new Color4(0, 0, 0, 0.5)),
    });
    */
    this.chat = <Chat>this.game.guiManager.add('chat', new Chat('chat', this.game));
    this.chat.width = '480px';
    this.chat.height = '280px';
    this.chat.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.chat.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.game.textureGUI.addControl(this.chat);

    /*, {
      id: 'chat',
      parent: this.screen,
      size: new Size(this.game.graphics.dpToPx(480), this.game.graphics.dpToPx(240)),
    }));
    */
  }
}

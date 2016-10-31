import {
  Vector2, Vector3, Size,
  Color3,
  Engine, Scene, ScreenSpaceCanvas2D, Canvas2D,
} from 'babylonjs';

import Graphics from './Utils/Graphics';

import AssetsLoader from './Lib/AssetsLoader';
import LoadingScreen from './Screens/LoadingScreen';

import NetworkClient from './Network/NetworkClient';

import AssetManager from './Managers/AssetManager';
import CameraManager from './Managers/CameraManager';
import LightManager from './Managers/LightManager';
import MaterialManager from './Managers/MaterialManager';
import ScreenManager from './Managers/ScreenManager';
import PlayerManager from './Managers/PlayerManager';
import Canvas2DManager from './Managers/Canvas2DManager';

//------------------------------------------------------------------------------------
// GAME FLOW INTERFACE
//------------------------------------------------------------------------------------

export interface IGameFlow {

  created: boolean;

  onCreate(): void;

  onResume(): void;

  onUpdate(): void;

  onResize(): void;

  onPause(): void;

  onDestroy(): void;

}

//------------------------------------------------------------------------------------
// GAME
//------------------------------------------------------------------------------------

export default class Game implements IGameFlow {

  /* SINGLETON */
  private static game: Game;

  /* STATE */
  public paused: boolean;
  public created: boolean;

  /* GAME ENGINE */
  public graphics: Graphics;
  public engine: Engine;
  public scene: Scene;
  public scene2d: ScreenSpaceCanvas2D;

  /* NETWORK */
  public network: NetworkClient;

  /* MANAGERS */
  public assetManager: AssetManager;
  public cameraManager: CameraManager;
  public lightManager: LightManager;
  public materialManager: MaterialManager;
  public screenManager: ScreenManager;
  public playerManager: PlayerManager;
  public canvas2DManager: Canvas2DManager;

  constructor(public canvas: HTMLCanvasElement) {
    if (!Game.game)
      Game.game = this;

    /* Engine */
    this.engine = new Engine(this.canvas, true, { stencil: true });
    this.engine.loadingScreen = new LoadingScreen(this.canvas, new Color3(0.4, 0.2, 0.3));
    this.engine.displayLoadingUI();

    /* Scene & Assets */
    this.scene = new Scene(this.engine);
    this.scene2d = new ScreenSpaceCanvas2D(this.scene, { id: 'gui', });

    /* Graphics */
    this.graphics = new Graphics(this);
    this.graphics.load();

    window.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 70:
          this.graphics.switchFullscreen();
          break;
      }
    });

    this.assetManager = new AssetManager(new AssetsLoader(this.scene));
    this.assetManager.loadAllAssets((tasks) => {

      /* Network */
      this.network = new NetworkClient(this);
      this.network.connect(NetworkClient.TYPE.HOST);

      /* Managers */
      this.cameraManager = new CameraManager(this);
      this.lightManager = new LightManager(this);
      this.materialManager = new MaterialManager(this);
      this.screenManager = new ScreenManager(this);
      this.playerManager = new PlayerManager(this);
      this.canvas2DManager = new Canvas2DManager(this);

      this.onCreate();
    });

    return Game.game;
  }

  //------------------------------------------------------------------------------------
  // GAME FLOW
  //------------------------------------------------------------------------------------

  onCreate() {
    this.screenManager.show('game');
    this.created = true;
    this.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onResume() {
    this.paused = false;

    if (!this.created)
      return;

    if (this.screenManager.activeScreen.created)
      this.screenManager.activeScreen.onResume();

    this.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onUpdate() {
    if (!this.created)
      return;

    if (this.screenManager.activeScreen.created)
      this.screenManager.activeScreen.onUpdate();

    this.scene.render();
  }

  onResize() {
    this.engine.resize();

    if (!this.created)
      return;

    if (this.screenManager.activeScreen.created)
      this.screenManager.activeScreen.onResize();
  }

  onPause() {
    this.paused = true;

    if (!this.created)
      return;

    if (this.screenManager.activeScreen.created)
      this.screenManager.activeScreen.onPause();

    this.engine.stopRenderLoop();
  }

  onDestroy() {
    this.screenManager.activeScreen.onDestroy();
    this.engine.stopRenderLoop();
  }
}

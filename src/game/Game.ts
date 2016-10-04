import {
  Vector2, Vector3, Size,
  Color3,
  Engine, Scene, ScreenSpaceCanvas2D,
} from 'babylonjs';

import Seed from './Math/Seed';
import HexagonLayout from './Math/HexagonLayout';
import Settings from './Logic/Settings';

import AssetsLoader from './Lib/AssetsLoader';
import LoadingScreen from './Screens/LoadingScreen';

import AssetManager from './Managers/AssetManager';
import ScreenManager from './Managers/ScreenManager';
import MaterialManager from './Managers/MaterialManager';
import LightManager from './Managers/LightManager';
import CameraManager from './Managers/CameraManager';
import PlayerManager from './Managers/PlayerManager';
import ViewManager from './Managers/ViewManager';

//------------------------------------------------------------------------------------
// GAME FLOW INTERFACE
//------------------------------------------------------------------------------------

export interface IGameFlow {
  
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

  private static game: Game;

  /* GAME ENGINE */
  public settings: Settings;
  public engine: Engine;
  public scene: Scene;
  public scene2d: ScreenSpaceCanvas2D;

  /* MANAGERS */
  public assetManager: AssetManager;
  public screenManager: ScreenManager;
  public materialManager: MaterialManager;
  public lightManager: LightManager;
  public cameraManager: CameraManager;
  public playerManager: PlayerManager;
  public viewManager: ViewManager;
  
  constructor(public canvas: HTMLCanvasElement) {
    if (!Game.game)
      Game.game = this;

    /* Settings */
    this.settings = {
      seed: new Seed(1),
      difficulty: 1,
      paused: false,
      graphics: {
        dpr: window.devicePixelRatio || 1,
        quality: 5,
      },
      world: {
        layout: new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL, new Size(0.5, 0.5), Vector3.Zero()),
        size: 16,
      }
    }

    /* Engine */
    this.engine = new Engine(this.canvas, true);
    this.engine.loadingScreen = new LoadingScreen(this.canvas, new Color3(0.4, 0.2, 0.3));
    this.engine.displayLoadingUI();

    /* Scene & Assets */
    this.scene = new Scene(this.engine);
    this.scene2d = new ScreenSpaceCanvas2D(this.scene, { id: 'gui' });
    this.assetManager = new AssetManager();
    this.assetManager.loadAllAssets(new AssetsLoader(this.scene), (tasks) => {

      /* Managers */
      this.screenManager = new ScreenManager(this);
      this.materialManager = new MaterialManager(this.scene, this.assetManager);
      this.lightManager = new LightManager(this.scene);
      this.cameraManager = new CameraManager(this.scene);
      this.playerManager = new PlayerManager(this.scene);
      //this.viewManager = new ViewManager(this.scene2d);

      this.onCreate();
    });

    return Game.game;
  }

  onCreate() {
    const mainMenu = this.screenManager.setCurrent('main-menu');
    mainMenu.onCreate();
    this.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onResume() {
    this.settings.paused = false;
    this.engine.runRenderLoop(this.onUpdate.bind(this));
  }

  onUpdate() {
    this.scene.render();
  }

  onResize() {
    this.engine.resize();
  }

  onPause() {
    this.settings.paused = true;
    this.engine.stopRenderLoop();
  }

  onDestroy() {
    this.engine.stopRenderLoop();
  }
}

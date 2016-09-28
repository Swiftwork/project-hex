import {
  Vector2, Vector3, Size,
  Color3,
  Engine, Scene, ScreenSpaceCanvas2D,
} from 'babylonjs';

import Seed from './Math/Seed';
import HexagonLayout from './Math/HexagonLayout';
import Settings from './Logic/Settings';

import GameWorld from './GameWorld';
import GameLogic from './GameLogic';
import GameRenderer from './GameRenderer';
import GameInterface from './GameInterface';

import AssetsLoader from './Lib/AssetsLoader';
import LoadingScreen from './Screens/LoadingScreen';

import AssetsManager from './Managers/AssetsManager';
import GUIManager from './Managers/GUIManager';
import CameraManager from './Managers/CameraManager';
import LightManager from './Managers/LightManager';
import MaterialManager from './Managers/MaterialManager';
import PlayerManager from './Managers/PlayerManager';

export default class Game {

  /* GAME */
  public settings: Settings;
  public engine: Engine;
  public scene: Scene;
  public gui: ScreenSpaceCanvas2D;
  public world: GameWorld;
  public logic: GameLogic;
  public renderer: GameRenderer;
  public interface: GameInterface;

  /* MANAGERS */
  public assetsManager: AssetsManager;
  public guiManager: GUIManager;
  public cameraManager: CameraManager;
  public lightManager: LightManager;
  public materialManager: MaterialManager;
  public playerManager: PlayerManager;
  
  constructor(public canvas: HTMLCanvasElement) {
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
    this.engine.loadingScreen = new LoadingScreen(this.canvas, new Color3(0.4,0.2,0.3));
    this.engine.displayLoadingUI();

    /* Scene & Assets */
    this.scene = new Scene(this.engine);
    this.gui = new ScreenSpaceCanvas2D(this.scene, { id: 'gui', size: new Size(
      this.canvas.clientWidth * this.settings.graphics.dpr,
      this.canvas.clientHeight * this.settings.graphics.dpr)
    });
    this.assetsManager = new AssetsManager();
    this.assetsManager.loadAllAssets(new AssetsLoader(this.scene), (tasks) => {

      /* Managers */
      this.guiManager = new GUIManager(this.gui);
      this.cameraManager = new CameraManager(this.scene);
      this.lightManager = new LightManager(this.scene);
      this.materialManager = new MaterialManager(this.scene, this.assetsManager);
      this.playerManager = new PlayerManager(this.scene);

      /* Game */
      this.world = new GameWorld(this);
      this.logic = new GameLogic(this, this.world, this.scene);
      this.renderer = new GameRenderer(this, this.world, this.scene);
      this.interface = new GameInterface(this, this.scene);
      this.onStart();
    });
  }

  onStart() {
    this.logic.onCreate();
    this.renderer.onCreate();
    this.interface.onCreate();
  }

  onResume() {
    this.settings.paused = false;
    this.logic.onResume();
    this.renderer.onResume();
    this.interface.onResume();
  }

  onResize() {
    this.engine.resize();
    this.interface.onResize();
  }

  onPause() {
    this.settings.paused = true;
    this.logic.onPause();
    this.renderer.onPause();
    this.interface.onPause();
  }

  onQuit() {
    this.logic.onDestroy();
    this.renderer.onDestroy();
    this.interface.onDestroy();
  }
}

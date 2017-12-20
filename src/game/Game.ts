import { AbstractMesh, Color3, Engine, Quaternion, Scene, Size, Vector3, Plane, Mesh } from 'babylonjs';
import { AdvancedDynamicTexture } from 'babylonjs-gui';

import AssetsLoader from './Lib/AssetsLoader';
import AssetManager from './Managers/AssetManager';
import CameraManager from './Managers/CameraManager';
import GuiManager from './Managers/GuiManager';
import LightManager from './Managers/LightManager';
import MaterialManager from './Managers/MaterialManager';
import PlayerManager from './Managers/PlayerManager';
import ScreenManager from './Managers/ScreenManager';
import NetworkClient from './Network/NetworkClient';
import LoadingScreen from './Screens/LoadingScreen';
import Graphics from './Utils/Graphics';

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
  public sceneOverlay: Mesh;
  public textureGUI: AdvancedDynamicTexture;
  public textureOverlay: AdvancedDynamicTexture;

  /* NETWORK */
  public network: NetworkClient;

  /* MANAGERS */
  public assetManager: AssetManager;
  public cameraManager: CameraManager;
  public lightManager: LightManager;
  public materialManager: MaterialManager;
  public screenManager: ScreenManager;
  public playerManager: PlayerManager;
  public guiManager: GuiManager;

  constructor(public canvas: HTMLCanvasElement) {
    if (!Game.game)
      Game.game = this;

    /* Engine */
    this.engine = new Engine(this.canvas, true, { stencil: true });
    this.engine.loadingScreen = new LoadingScreen(this.canvas, new Color3(0.4, 0.2, 0.3));
    this.engine.displayLoadingUI();

    /* Mac CubeTexture Fix */
    if (window.navigator.platform === 'MacIntel')
      this.engine['_badOS'] = true;

    console.log(this.engine);

    /* Graphics */
    this.graphics = new Graphics(this);
    this.graphics.load();

    /* Scene */
    this.scene = new Scene(this.engine);
    this.sceneOverlay = Mesh.CreatePlane('sceneOverlay', 32, this.scene);
    this.sceneOverlay.renderingGroupId = 1;
    this.sceneOverlay.isPickable = false;

    this.textureGUI = AdvancedDynamicTexture.CreateFullscreenUI('sceneGUI', true, this.scene);
    this.textureOverlay = AdvancedDynamicTexture.CreateForMesh(this.sceneOverlay);
    /*
    this.sceneOverlay = new WorldSpaceCanvas2D(this.scene, new Size(32, 32), {
      id: 'world2d',
      worldPosition: new Vector3(0, 0.15, 0),
      worldRotation: Quaternion.RotationYawPitchRoll(0, Graphics.toRadians(90), 0),
      enableInteraction: false,
      //backgroundFill: Canvas2D.GetSolidColorBrushFromHex("#202020FF"),
    });
    (<AbstractMesh>this.sceneOverlay.worldSpaceCanvasNode).renderingGroupId = 1;
    (<AbstractMesh>this.sceneOverlay.worldSpaceCanvasNode).isPickable = false;
    */
    this.assetManager = new AssetManager(new AssetsLoader(this.scene));
    this.assetManager.loadAllAssets((tasks) => {

      /* Network */
      this.network = new NetworkClient(this);
      this.network.connect(Math.round(Math.random()));

      /* Managers */
      this.cameraManager = new CameraManager(this);
      this.lightManager = new LightManager(this);
      this.materialManager = new MaterialManager(this);
      this.screenManager = new ScreenManager(this);
      this.playerManager = new PlayerManager(this);
      this.guiManager = new GuiManager(this);

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

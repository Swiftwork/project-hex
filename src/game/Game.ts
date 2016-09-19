import {
  Vector2, Vector3,
	Color3,
	Engine, Scene,
	AssetsManager as AssetsLoader,
} from 'babylonjs';

import AssetsManager from './Managers/AssetsManager';
import Seed from './Math/Seed';
import HexagonLayout from './Math/HexagonLayout';
import Settings from './Logic/Settings';

import GameWorld from './GameWorld';
import GameLogic from './GameLogic';
import GameRenderer from './GameRenderer';

import LoadingScreen from './Screens/LoadingScreen';

export default class Game {

	public settings: Settings;
	public engine: Engine;
	public scene: Scene;
	public world: GameWorld;
	public logic: GameLogic;
	public renderer: GameRenderer;

	/* MANAGERS */
	public assetsManager: AssetsManager;
	
	constructor(public canvas: HTMLCanvasElement) {
    /* Settings */
		this.settings = {
			seed: new Seed(1),
			difficulty: 1,
			paused: false,
			graphics: {
				quality: 5,
			},
      world: {
        layout: new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL, new Vector2(0.5, 0.5), Vector3.Zero()),
        size: 32,
      }
		}

    /* Engine */
		this.engine = new Engine(this.canvas, true);
		this.engine.loadingScreen = new LoadingScreen(this.canvas, new Color3(0.4,0.2,0.3));
		this.engine.displayLoadingUI();

    /* Scene & Assets */
    this.scene = new Scene(this.engine);
    this.assetsManager = new AssetsManager();
    this.assetsManager.loadAllAssets(new AssetsLoader(this.scene), (tasks) => {
			this.world = new GameWorld(this);
			this.logic = new GameLogic(this, this.world, this.scene);
			this.renderer = new GameRenderer(this, this.world, this.scene);
    	this.onStart();
    });
	}

	onStart() {
		this.logic.onCreate();
		this.renderer.onCreate();
	}

	onResume() {
		this.settings.paused = false;
		this.logic.onResume();
		this.renderer.onResume();
	}

	onResize() {
		this.engine.resize();
	}

	onPause() {
		this.settings.paused = true;
		this.logic.onPause();
		this.renderer.onPause();
	}

	onQuit() {
		this.logic.onDestroy();
		this.renderer.onDestroy();
	}
}

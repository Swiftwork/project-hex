import {
	Engine, Scene,
	AssetsManager as AssetsLoader,
} from 'babylonjs';
import AssetsManager from './Managers/AssetsManager';
import GameWorld from './GameWorld';
import GameRenderer from './GameRenderer';

/* Utils */
import Seed from './Utils/Seed';

export class settings {
	seed: Seed;
	difficulty: number;
	paused: boolean;
	graphics: {
		quality: number;
	};
}

export default class Game {

	public settings: settings;
	public engine: Engine;
	public scene: Scene;
	public world: GameWorld;
	public renderer: GameRenderer;

	/* MANAGERS */
	public assetsManager: AssetsManager;
	
	constructor(public canvas: HTMLCanvasElement) {
		this.settings = {
			seed: new Seed(2),
			difficulty: 1,
			paused: false,
			graphics: {
				quality: 5,
			}
		}

		this.engine = new Engine(this.canvas, true);
		this.engine.displayLoadingUI();

    this.scene = new Scene(this.engine);
    this.assetsManager = new AssetsManager();
    this.assetsManager.loadAllAssets(new AssetsLoader(this.scene), (tasks) => {
			this.world = new GameWorld(this, this.scene);
			this.renderer = new GameRenderer(this, this.world, this.scene);
    	this.onStart();
    });
	}

	onStart() {
		this.world.onCreate();
		this.renderer.onCreate();
	}

	onResume() {
		this.settings.paused = false;
		this.world.onResume();
		this.renderer.onResume();
	}

	onResize() {
		this.engine.resize();
	}

	onPause() {
		this.settings.paused = true;
		this.world.onPause();
		this.renderer.onPause();
	}

	onQuit() {
		this.world.onDestroy();
		this.renderer.onDestroy();
	}
}

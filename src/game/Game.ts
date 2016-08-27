import { Engine } from 'babylonjs';
import world from './GameWorld';
import renderer from './GameRenderer';

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

	settings: settings;
	engine: Engine;
	world: world;
	renderer: renderer;
	
	constructor(public canvas: HTMLCanvasElement) {
		this.settings = {
			seed: new Seed(Math.random()),
			difficulty: 1,
			paused: false,
			graphics: {
				quality: 5,
			}
		}

		this.engine = new Engine(this.canvas, true);
		this.world = new world(this);
		this.renderer = new renderer(this, this.world);
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

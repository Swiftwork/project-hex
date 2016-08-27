import Game from './Game';
import Hexagon from './Math/Hexagon';
import Tile from './Entities/Tile';

export default class GameWorld {

	public tiles: Map<string, Tile>;

	constructor(
		private game: Game
	) {
		this.tiles = new Map<string, Tile>();
		//const mapRadius = 64;
		const mapRadius = 1;

		for (let q = -mapRadius; q <= mapRadius; q++) {
	    const r1 = Math.max(-mapRadius, -q - mapRadius);
	    const r2 = Math.min(mapRadius, -q + mapRadius);
	    for (let r = r1; r <= r2; r++) {
	    	let tile = new Tile(new Hexagon(q, r, -q-r));
      	this.tiles.set(tile.hexagon.toString(), tile);
      }
		}
	}

	onLoaded () {
		this.onCreate();
	}

	onCreate() {
		this.onUpdate();
	}

	onResume() {
		this.onUpdate();
	}

	onUpdate() {

	}

	onPause () {
		
	}

	onDestroy () {

	}
}
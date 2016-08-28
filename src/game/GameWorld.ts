import {
	Vector2, Vector3,
} from 'babylonjs';
import Game from './Game';
import Hexagon from './Math/Hexagon';
import Tile from './Entities/Tile';
import { HexagonLayout } from './Math/HexagonLayout';

export default class GameWorld {

	public tiles: Map<string, Tile>;
	public layout: HexagonLayout;

	constructor(
		private game: Game
	) {
		this.tiles = new Map<string, Tile>();
    this.layout = new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL,
    	new Vector2(0.5, 0.5),
    	new Vector3(0, 0, 0)
    );
		//const mapRadius = 64;
		const mapRadius = 4;
		const visibility = 2;

		for (let q = -mapRadius; q <= mapRadius; q++) {
	    const r1 = Math.max(-mapRadius, -q - mapRadius);
	    const r2 = Math.min(mapRadius, -q + mapRadius);
	    for (let r = r1; r <= r2; r++) {
	    	let tile = new Tile(new Hexagon(q, r, -q-r));
	    	if (tile.hexagon.distance(new Hexagon(0,0,0)) <= visibility)
	    		tile.explored = true;
      	this.tiles.set(tile.hexagon.toString(), tile);
      }
		}
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
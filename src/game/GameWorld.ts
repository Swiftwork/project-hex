import {
	Scene,
	Vector2, Vector3,
} from 'babylonjs';
import Game from './Game';
import Hexagon from './Math/Hexagon';
import Entity from './Entities/Entity';
import Tile from './Entities/Tile';
import { HexagonLayout } from './Math/HexagonLayout';

export default class GameWorld {

	public tiles: Map<number, Tile>;
	public layout: HexagonLayout;

	constructor(
		private game: Game,
		private scene: Scene
	) {
		/* Scene */
    this.scene.collisionsEnabled = false;

    /* Tiles */
		this.tiles = new Map<number, Tile>();
    this.layout = new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL,
    	new Vector2(0.5, 0.5),
    	new Vector3(0, 0, 0)
    );
		const mapRadius = 10;
		const visibility = 2;
		const viewPoint = new Hexagon(0,0,0);

		for (let q = -mapRadius; q <= mapRadius; q++) {
	    const r1 = Math.max(-mapRadius, -q - mapRadius);
	    const r2 = Math.min(mapRadius, -q + mapRadius);
	    for (let r = r1; r <= r2; r++) {
	    	const hex = new Hexagon(q, r, -q-r);
	    	const id = hex.hash();
	    	const tile = new Tile(hex, this.getTileType(id));

	    	/* Visibility */
	    	if (tile.hexagon.distance(viewPoint) <= visibility)
	    		tile.explored = true;

	    	if (tile.type === 'forest') {
	    		tile.addEnvironment([
	    			new Entity('tree-0', 'birch-tree'),
	    			new Entity('tree-1', 'birch-tree'),
	    			new Entity('tree-2', 'birch-tree'),
	    			new Entity('tree-3', 'birch-tree'),
	    			new Entity('tree-4', 'birch-tree'),
	    			new Entity('tree-5', 'birch-tree'),
	    			new Entity('tree-6', 'birch-tree'),
	    			new Entity('tree-7', 'birch-tree'),
	    			new Entity('tree-8', 'birch-tree'),
	    			new Entity('tree-9', 'birch-tree'),
	    			new Entity('tree-10', 'birch-tree'),
	    		]);
	    	}

      	this.tiles.set(id, tile);
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

	private getTileType(hash: number): string {
		const types = Object.keys(Tile.TYPES);
		const type = Math.abs(this.game.settings.seed.random() * hash % types.length) << 0;
		return Tile.TYPES[types[type]];
	}
}
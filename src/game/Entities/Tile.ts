import Hexagon from '../Math/Hexagon';
import Entity from './Entity';
import Structure from './Structure';
import Unit from './Unit';

export default class Tile {

	public static TYPES = {
		BARREN: 'barren',
		PLAIN: 'plain',
		DESERT: 'desert',
		OCEAN: 'ocean',
		MOUNTAIN: 'mountain',
		FOREST: 'forest',
	};

	public explored = false;

	private environment: Entity[];
	private structure: Structure;
	private unit: Unit;

	constructor(
		public hexagon: Hexagon,
		public type?: string
	) {
		if (typeof type === 'undefined') {
			const types = Object.keys(Tile.TYPES);
			this.type = Tile.TYPES[types[types.length * Math.random() << 0]];
		}
	}

	/* Add entity belonging to this tile */
	public addEntity(...entity: Entity[]): Entity {
		return new Entity();
	}

	/* Get all entities belonging to this tile */
	public getEntities(...entity: Entity[]) {
	}

	public clearEntities(): boolean {
		return true;
	}
}
import Hexagon from '../Math/Hexagon';
import Entity from './Entity';
import Structure from './Structure';
import Unit from './Unit';

export default class Tile {

	/* Tile biome types */
	public static TYPES = {
		ARCTIC: 'arctic',
		BARREN: 'barren',
		DESERT: 'desert',
		FOREST: 'forest',
		GLACIER: 'glacier',
		MOUNTAIN: 'mountain',
		OCEAN: 'ocean',
		PLAIN: 'plain',
	};

	/* Tile biome data e.g. forest density */
	public biomeData: any = {}

	/* Tile states */
	public explored = false;

	/* Entities residing on top of tile */
	public environment: Entity[] = [];
	public structure: Structure;
	public unit: Unit;

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
	public addEnvironment(entities: Entity[]): Entity[] {
		this.environment = this.environment.concat(entities);
		return entities;
	}

	/* Get all entities belonging to this tile */
	public getEntities(...entity: Entity[]) {
	}

	public clearEntities(): boolean {
		return true;
	}
}
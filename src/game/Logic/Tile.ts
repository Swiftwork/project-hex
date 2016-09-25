import Hexagon from '../Math/Hexagon';
import Environment from '../Entities/Environment';
import Structure from '../Entities/Structure';
import Unit from '../Entities/Unit';

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

  /* Tile biome types */
	public static SURFACES = {
    PLAIN: 'hex-plain',
    MOUNTAIN: 'hex-mountain-high',
    GRASS: 'hex-plain-low',
    DUNES: 'hex-desert-dunes',
    OCEAN: 'hex-ocean-low',
	};

	/* Tile biome data e.g. forest density */
	public biomeData: any = {}
  public surface: string = Tile.SURFACES.PLAIN;

	/* Tile states */
	public isExplored = false;
	public isVisible = false;

	/* Entities residing on top of tile */
	public environment: Environment[] = [];
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

	/* Add entities belonging to this tile */
	public addEnvironment(environment: Environment[]): Environment[] {
		this.environment = this.environment.concat(environment);
		return environment;
	}

  /* Add a structure belonging to this tile */
	public setStructure(structure: Structure): Structure {
		this.structure = structure;
		return structure;
	}

  /* Add a structure belonging to this tile */
	public setUnit(unit: Unit): Unit {
		this.unit = unit;
		return unit;
	}
}
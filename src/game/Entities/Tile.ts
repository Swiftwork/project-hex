import Hexagon from '../Math/Hexagon';
import Environment from '../Entities/Environment';
import Structure from '../Entities/Structure';
import Unit from '../Entities/Unit';

export interface ITile {
  hexagon: Hexagon;
  type?: string;
  biomeData: any;
  surface: string;

  isExplored: boolean;
  isVisible: boolean;

  environment: Environment[];
  structure: Structure;
  unit: Unit;
}

export default class Tile implements ITile {

  /* Tile biome types */
  public static TYPE = {
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
  public static SURFACE = {
    PLAIN: 'hex-plain',
    MOUNTAIN: 'hex-mountain-high',
    GRASS: 'hex-plain-low',
    DUNES: 'hex-desert-dunes',
    OCEAN: 'hex-ocean-low',
  };

  /* Tile biome data e.g. forest density */
  public biomeData: any = {}
  public surface = Tile.SURFACE.PLAIN;

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
      const types = Object.keys(Tile.TYPE);
      this.type = Tile.TYPE[types[types.length * Math.random() << 0]];
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

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: ITile | string): Tile {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Tile.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(Tile.prototype), json, {
        hexagon: Hexagon.fromJSON(json.hexagon),
        environment: json.environment.map((environment: Environment) => { return Environment.fromJSON(environment); }),
        structure: Structure.fromJSON(json.structure),
        unit: Unit.fromJSON(json.unit),
      });
    }
  }
}
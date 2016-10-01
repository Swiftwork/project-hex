import Tile from '../Logic/Tile';
import Structure from '../Entities/Structure';
import Unit from '../Entities/Unit';

/* Structures */
import Base from '../Entities/Structures/Base';

/* Units */
import Scout from '../Entities/Units/Scout';

export default class Player {

  public static TYPES = {
    LOCAL: 0,
    REMOTE: 1,
    NPC: 2,
    SPECTATOR: 3,
  }

  public structures: Structure[] = [];
  public units: Unit[] = [];

  constructor(
    public name: string,
    public type: number
  ) {
  }

  createBase(tile: Tile): Base {
    const base = new Base(`base-${this.structures.length}`, tile, 'viking-village-1')
    tile.setStructure(base);
    this.structures.push(base);
    return base;
  }

  createScout(tile: Tile): Scout {
    const scout = new Scout(`scout-${this.units.length}`, tile, 'scout');
    tile.setUnit(scout);
    this.units.push(scout);
    return scout;
  }
}
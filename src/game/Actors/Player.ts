import {

} from 'babylonjs';

import Tile from '../Entities/Tile';
import Structure from '../Entities/Structure';
import Unit from '../Entities/Unit';

/* Structures */
import Base from '../Entities/Structures/Base';

/* Units */
import Scout from '../Entities/Units/Scout';

export interface IPlayer {
  structures: Structure[];
  units: Unit[];
  name: string,
  type: number,
}

export default class Player implements IPlayer {

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
    const base = new Base(`base-${this.structures.length}`, tile.id, 'viking-village-1')
    tile.setStructure(base);
    this.structures.push(base);
    return base;
  }

  createScout(tile: Tile): Scout {
    const scout = new Scout(`scout-${this.units.length}`, tile.id, 'scout');
    tile.setUnit(scout);
    this.units.push(scout);
    return scout;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IPlayer | string): Player {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Structure.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Player.prototype), json, {
        structures: json.structures.map((structure: Structure) => { return Structure.fromJSON(structure); }),
        units: json.units.map((unit: Unit) => { return Unit.fromJSON(unit); }),
      });
    }
  }
}

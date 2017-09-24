import {
} from 'babylonjs';

import Entity, { IEntity } from './Entity';

export interface IUnit extends IEntity {
  ownerId: string;
  type: number;
  sight: number;
  movement: number;
}

export default class Unit extends Entity implements IUnit {

  static TYPE = {
    TERRESTRIAL: 0,
    AQUATIC: 1,
    AERIAL: 2,
  }

  public ownerId = 'none';
  public type = Unit.TYPE.TERRESTRIAL;
  public sight = 2;
  public movement = 3;

  constructor(
    public id: string,
    public tileId: number,
    public model?: string
  ) {
    super(id, tileId, model);

  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IUnit | string): Unit {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Unit.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Unit.prototype), super.fromJSON(json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}

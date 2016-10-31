import {
} from 'babylonjs';

import Entity, { IEntity } from './Entity';

export interface IUnit extends IEntity {
  visibility: number;
}

export default class Unit extends Entity implements IUnit {

  static STAGES = {
    1: 3,
    2: 4,
    3: 5,
  }

  public visibility = 1;

  constructor(
    public id: string,
    public model?: string
  ) {
    super(id, model);
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IUnit | string): Unit {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Unit.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(Unit.prototype), super.fromJSON(json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}
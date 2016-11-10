import {
} from 'babylonjs';

import Entity, { IEntity } from './Entity';

export interface IStructure extends IEntity {
  ownerId: string;
  sight: number;
}

export default class Structure extends Entity implements IStructure {

  static STAGES = {
    1: 3,
    2: 4,
    3: 5,
  }

  public ownerId = 'none';
  public sight = 3;

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

  static fromJSON(json: IStructure | string): Structure {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Structure.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(Structure.prototype), super.fromJSON(json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}
import {

} from 'babylonjs';

import Entity, { IEntity } from './Entity';

export interface IEnvironment extends IEntity {

}

export default class Environment extends Entity implements IEnvironment {

  constructor(
    public id: string,
    public model?: string
  ) {
    super(id, model);
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IEnvironment | string): Environment {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Environment.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(Environment.prototype), super.fromJSON(json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}
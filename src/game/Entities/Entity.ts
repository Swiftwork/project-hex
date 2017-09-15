import {
  Vector3,
} from 'babylonjs';

export interface IEntity {
  position: Vector3;
  id: string;
  tileId: number;
  model?: string;
}

export default class Entity implements IEntity {

  public position: Vector3;

  constructor(
    public id: string,
    public tileId: number,
    public model?: string
  ) {
    this.position = new Vector3(0, 0, 0);
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IEntity | string): Entity {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Entity.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Entity.prototype), json, {
        position: new Vector3(json.position.x, json.position.y, json.position.z),
      });
    }
  }
}

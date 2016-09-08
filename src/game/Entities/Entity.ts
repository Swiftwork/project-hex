import {
  Vector3,
} from 'babylonjs';

export default class Entity {

  public position: Vector3;
  public pathArray: Vector3[][];
  
  constructor(public id: string, public model?: string) {
    this.position = new Vector3(0, 0, 0);
  }
}
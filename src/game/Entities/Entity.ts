import {
  Vector3,
} from 'babylonjs';
import Tile from './Tile'

export default class Entity {

  public position: Vector3;
  
  constructor(
    public id: string,
    public tile: Tile, 
    public model?: string
  ) {
    this.position = new Vector3(0, 0, 0);
  }
}
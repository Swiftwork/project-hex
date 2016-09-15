import Entity from './Entity';
import Tile from '../Entities/Tile';

export default class Unit extends Entity {
  
  constructor(
    public id: string,
    public tile: Tile,
    public model?: string
  ) {
    super(id, model);
  }
}
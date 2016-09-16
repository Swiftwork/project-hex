import Entity from './Entity';
import Tile from '../Entities/Tile';

export default class Environment extends Entity {
  
  constructor(id: string, tile: Tile, model?: string) {
    super(id, tile, model);
  }
}
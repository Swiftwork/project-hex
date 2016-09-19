import Entity from './Entity';
import Tile from '../Logic/Tile'

export default class Environment extends Entity {
  
  constructor(id: string, tile: Tile, model?: string) {
    super(id, tile, model);
  }
}
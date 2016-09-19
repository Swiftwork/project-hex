import Entity from './Entity';
import Tile from '../Logic/Tile'
import Player from '../Actors/Player';

export default class Unit extends Entity {
  
  public owner: Player;
  
  public visibility = 1;

  constructor(
    public id: string,
    public tile: Tile,
    public model?: string
  ) {
    super(id, tile, model);
  }
}
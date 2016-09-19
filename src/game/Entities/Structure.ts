import Entity from './Entity';
import Tile from '../Logic/Tile'
import Player from '../Actors/Player';

export default class Structure extends Entity {

  public stages = {
    1: 3,
    2: 4,
    3: 5,
  }

  public owner: Player;
  
  public visibility = 2;
  
  constructor(
    public id: string,
    public tile: Tile,
    public model?: string
  ) {
    super(id, tile, model);
  }
}
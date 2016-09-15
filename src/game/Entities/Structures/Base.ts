import Structure from '../Structure';
import Tile from '../../Entities/Tile';

export default class Base extends Structure{

  public stage = 0;

  constructor(
    public id: string,
    public tile: Tile,
    public model?: string
  ) {
    super(id, tile, model);
  }
}
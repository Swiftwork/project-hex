import Unit from '../Unit';
import Tile from '../../Logic/Tile'

export default class Scout extends Unit {

  constructor(
    public id: string,
    public tile: Tile,
    public model?: string
  ) {
    super(id, tile, model);
  }
}
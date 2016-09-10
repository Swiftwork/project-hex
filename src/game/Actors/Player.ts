import Tile from '../Entities/Tile';

class Base {

  public stage = 0;

  constructor(
    public tile: Tile
  ) {
  }
}

export default class Player {

  public static TYPES = {
    LOCAL: 0,
    REMOTE: 1,
    NPC: 2,
  }

  public base: Base;

  constructor(
    public name: string,
    public type: number
  ) {
  }

  createBase(tile: Tile) {
    this.base = new Base(tile);
  }
}
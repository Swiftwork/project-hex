import {

} from 'babylonjs';

export default class Resource {

  public static TYPE = {
    WOOD: 'wood',
    STONE: 'stone',
    METAL: 'metal',
    FOOD: 'food',
    POPULATION: 'population',
  }

  constructor(
    public type: string,
    public value = 0,
  ) {

  }
}
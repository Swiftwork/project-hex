/// <reference path="node_modules/babylonjs/babylon.d.ts" />

interface Math {
  /*
    * Returns a random value between a given maximum and minimum.
    * @param min is the lower constraint for the random number.
    * @param max is the upper constraint for the random number.
    */
  randomBetween(min: number, max: number): number
}

interface Array<T> {
  /*
   * Returns a random element from this array.
   * @param seed if provided, will be used as a base to calculate which item is to be returned.
   */
  random(seed?: number): T;
}

/* Export of the BabylonJS declarations to allow the components to be imported into project */
declare module "babylonjs" {
  export = BABYLON;
}
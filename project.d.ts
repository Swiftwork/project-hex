/// <reference path="node_modules/babylonjs/babylon.d.ts"/>
/// <reference path="node_modules/babylonjs/babylon.canvas2d.d.ts"/>

//------------------------------------------------------------------------------------
// EXPORT MODULES
//------------------------------------------------------------------------------------

/* Export of the BabylonJS declarations to allow the components to be imported into project */
declare module 'babylonjs' {
  export = BABYLON;
}

/* Export of the BabylonJS Canvas2D declarations to allow the components to be imported into project
declare module 'babylonjs/babylon.canvas2d' {
  export = BABYLON;
}
*/

/* Export of a dummy module declaration for socket.io-p2p */
declare module 'socket.io-p2p' {
  var P2P: any;
  export = P2P;
}

//------------------------------------------------------------------------------------
// EXTEND BASICS
//------------------------------------------------------------------------------------

interface Math {
  /*
   * Returns a random value between a given maximum and minimum.
   * @param min is the lower constraint for the random number.
   * @param max is the upper constraint for the random number.
   */
  randomBetween(min: number, max: number): number;

  /*
   * Returns the value contrained by a minimum and maximum.
   * @param value which is to be contraint by the min and max.
   * @param min is the lower constraint for the value.
   * @param max is the upper constraint for the value.
   */
  clamp(value: number, min: number, max: number): number;

  /*
   * Returns a number inside a linear interpolation based on the alpha.
   * @param min is the starting value for the linear interpolation.
   * @param max is the finishing value for the linear interpolation.
   * @param alpha is the percentage at which to select the value.
   */
  lerp(min: number, max: number, alpha: number): number;
}

interface Array<T> {
  /*
   * Returns a random element from this array.
   * @param seed if provided, will be used as a base to calculate which item is to be returned.
   */
  random(seed?: number): T;
}

interface String {
  /*
   * Capitalizes the first letter of the string.
   */
  capitalize(): string;
}

//------------------------------------------------------------------------------------
// POTENTIAL TEMP FIXES
//------------------------------------------------------------------------------------

/* HTMLCanvasElement definition mismatch
interface HTMLCanvasElement extends HTMLElement {
    requestPointerLock(): void;
    msRequestPointerLock(): void;
    mozRequestPointerLock(): void;
    webkitRequestPointerLock(): void;
}
*/
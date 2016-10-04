/// <reference path="node_modules/babylonjs/babylon.d.ts" />

//------------------------------------------------------------------------------------
// EXPORT MODULES
//------------------------------------------------------------------------------------

/* Export of the BabylonJS declarations to allow the components to be imported into project */
declare module 'babylonjs' {
  export = BABYLON;
}

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
  randomBetween(min: number, max: number): number
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

/* HTMLCanvasElement definition mismatch */
interface HTMLCanvasElement extends HTMLElement {
    requestPointerLock(): void;
    msRequestPointerLock(): void;
    mozRequestPointerLock(): void;
    webkitRequestPointerLock(): void;
}
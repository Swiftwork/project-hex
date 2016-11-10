import {
  Vector2, Vector3, Size,
} from 'babylonjs';

import Game from '../Game';

export interface IGraphics {
  dpr: number;
  resolution: number;
  fullscreen: boolean;
}

export default class Graphics implements IGraphics {

  /* SETTINGS */
  private _dpr: number;
  private _resolution: number;
  private _fullscreen: boolean;

  constructor(public game: Game) {
    this.dpr = window.devicePixelRatio || 1;
    this.resolution = 1200;
  }

  //------------------------------------------------------------------------------------
  // LOCAL STORAGE
  //------------------------------------------------------------------------------------

  public load(): boolean {
    const json = JSON.parse(localStorage.getItem('graphics') || 'null');
    if (!json) return false;

    this.dpr = json.dpr;
    this.resolution = json.resolution;
    return true;
  }

  public store() {
    localStorage.setItem('graphics', JSON.stringify({
      dpr: this.dpr,
      resolution: this.resolution,
    }));
  }

  //------------------------------------------------------------------------------------
  // STATIC HELPERS
  //------------------------------------------------------------------------------------

  public dpToPx(dp: number): number {
    return dp / (1 / (this.resolution / window.screen.height));
  }

  static toRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }

  static toDegrees(radians: number) {
    return radians * 180 / Math.PI;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get graphics() {
    return {
      dpr: this.dpr,
      resolution: this.resolution,
    };
  }

  public get dpr(): number {
    return this._dpr;
  }

  public set dpr(dpr: number) {
    this._dpr = dpr;
    this.store();
  }

  public get resolution(): number {
    return this._resolution;
  }

  public set resolution(resolution: number) {
    this._resolution = resolution;
    this.game.engine.setHardwareScalingLevel(1 / (this.resolution / window.screen.height));
    this.store();
  }

  public get fullscreen(): boolean {
    return this.game.engine.isFullscreen;
  }

  public switchFullscreen() {
    this.game.engine.switchFullscreen(false);
    this.store();
  }
};
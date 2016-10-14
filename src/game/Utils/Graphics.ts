import {
  Vector2, Vector3, Size,
} from 'babylonjs';

import Game from '../Game';

export default class Graphics {

  private _dpr: number;
  private _resolution: number;

  constructor(private game: Game) {
    this.dpr = window.devicePixelRatio || 1;
    this.resolution = 1200;
  }

  //------------------------------------------------------------------------------------
  // STATIC HELPERS
  //------------------------------------------------------------------------------------

  public dpToPx(dp: number): number {
    return dp / (1 / (this.resolution / window.screen.height));
  }

  public toRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }

  public toDegrees(radians: number) {
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
  }

  public get resolution(): number {
    return this._resolution;
  }

  public set resolution(resolution: number) {
    this._resolution = resolution;
    this.game.engine.setHardwareScalingLevel(1 / (this.resolution / window.screen.height));
  }

  public get fullscreen(): boolean {
    return this.game.engine.isFullscreen;
  }

  public switchFullscreen() {
    this.game.engine.switchFullscreen(false);
  }
};
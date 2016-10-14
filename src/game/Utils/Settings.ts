import {
  Vector2, Vector3, Size,
} from 'babylonjs';

import Game from '../Game';
import Seed from '../Math/Seed';
import HexagonLayout from '../Math/HexagonLayout';

export default class Settings {

  public static DIFFICULTY = {
    EASY: 1,
    NORMAL: 2,
    HARD: 3,
  }

  private _difficulty: number;
  private _paused: boolean;

  private _seed: Seed;
  private _layout: HexagonLayout;
  private _size: number;

  constructor(private game: Game) {
    this.paused = false;
    this.difficulty = Settings.DIFFICULTY.NORMAL;

    this.seed = new Seed(1);
    this.layout = new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL, new Size(0.5, 0.5), Vector3.Zero());
    this.size = 16;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /* GAME */

  public get paused(): boolean {
    return this._paused;
  }

  public set paused(paused: boolean) {
    this._paused = paused;
  }

  public get difficulty(): number {
    return this._difficulty;
  }

  public set difficulty(difficulty: number) {
    this._difficulty = difficulty;
  }

  /* WORLD */

  public get seed(): Seed {
    return this._seed;
  }

  public set seed(seed: Seed) {
    this._seed = seed;
  }

  public get layout(): HexagonLayout {
    return this._layout;
  }

  public set layout(layout: HexagonLayout) {
    this._layout = layout;
  }

  public get size(): number {
    return this._size;
  }

  public set size(size: number) {
    this._size = size;
  }
};
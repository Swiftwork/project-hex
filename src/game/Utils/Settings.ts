import {
  Vector2, Vector3, Size,
} from 'babylonjs';

import Seed from '../Math/Seed';
import HexagonLayout from '../Math/HexagonLayout';

export interface ISettings {
  difficulty: number;
  paused: boolean;

  seed: Seed
  layout: HexagonLayout;
  size: number;
}

export default class Settings implements ISettings {

  public static DIFFICULTY = {
    EASY: 1,
    NORMAL: 2,
    HARD: 3,
  }

  /* SETTINGS */
  private _difficulty: number;
  private _paused: boolean;

  private _seed: Seed;
  private _layout: HexagonLayout;
  private _size: number;

  constructor() {
    this.difficulty = Settings.DIFFICULTY.NORMAL;
    this.paused = false;

    this.seed = new Seed(Math.random());
    this.layout = new HexagonLayout(HexagonLayout.LAYOUT_HORIZONTAL, new Size(0.5, 0.5), Vector3.Zero());
    this.size = 16;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  public toJSON(): ISettings {
    return {
      difficulty: this.difficulty,
      paused: this.paused,

      seed: this.seed,
      layout: this.layout,
      size: this.size,
    };
  }

  static fromJSON(json: ISettings | string): Settings {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Settings.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Settings.prototype), json, {
        seed: Seed.fromJSON(json.seed),
        layout: HexagonLayout.fromJSON(json.layout),
      });
    }
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

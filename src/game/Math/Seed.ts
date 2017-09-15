export interface ISeed {
  seed: number;
}

export default class Seed implements ISeed {

  private _seed: number;

  constructor(seed: any) {
    if (typeof seed === 'number')
      this.seed = seed;
    else
      this.seed = this.charsToInt(seed);
  }

  public random() {
    return (11 * this.seed + 17) % 25 / 25;
  }

  public get seed(): number {
    return this._seed;
  }

  public set seed(seed: number) {
    this._seed = seed;
  }

  public charsToInt(chars: any): number {
    if (Array.isArray(chars))
      chars = chars.join('');

    if (typeof chars === 'number')
      chars = chars.toString();

    let int = 0;
    for (var i = 0; i < chars.length; ++i) {
      int += chars.charCodeAt(i) || 1;
    }
    return int;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  public toJSON(): ISeed {
    return {
      seed: this.seed,
    };
  }

  static fromJSON(json: ISeed | string): Seed {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Seed.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Seed.prototype), json, {
        // Special Cases
      });
    }
  }
}

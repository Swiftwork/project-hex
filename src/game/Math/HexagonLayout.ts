import {
  Vector2,
  Vector3,
  Size,
} from 'babylonjs';
import Hexagon from './Hexagon';

//------------------------------------------------------------------------------------
// ORIENTATION
//------------------------------------------------------------------------------------

export interface IHexagonOrientation {
  f0: number; f1: number; f2: number; f3: number;
  b0: number; b1: number; b2: number; b3: number;
  startAngle: number;
}

export class HexagonOrientation implements IHexagonOrientation {
  constructor(
    public f0: number, public f1: number, public f2: number, public f3: number,
    public b0: number, public b1: number, public b2: number, public b3: number,
    public startAngle: number
  ) { }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IHexagonOrientation | string): HexagonOrientation {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? HexagonOrientation.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(HexagonOrientation.prototype), json, {
        // Special Cases
      });
    }
  }
};

//------------------------------------------------------------------------------------
// LAYOUT
//------------------------------------------------------------------------------------

export interface IHexagonLayout {
  orientation: HexagonOrientation;
  size: Size;
  origin: Vector3;
}

export default class HexagonLayout implements IHexagonLayout {

  public static LAYOUT_VERTICAL = new HexagonOrientation(
    Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0,
    Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0,
    0.5
  );

  public static LAYOUT_HORIZONTAL = new HexagonOrientation(
    3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0),
    2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0,
    0.0
  );

  public static RHOMBUSES = [
    new Vector2(-1, 0),
    new Vector2(0.5, Math.sqrt(3) / 2),
    new Vector2(0.5, -Math.sqrt(3) / 2),
  ];

  constructor(
    public orientation: HexagonOrientation,
    public size: Size,
    public origin: Vector3
  ) {

  }

  public hexagonToPixel(hex: Hexagon, y?: number): Vector3 | Vector2 {
    const x = (this.orientation.f0 * hex.q + this.orientation.f1 * hex.r) * this.size.width;
    const z = (this.orientation.f2 * hex.q + this.orientation.f3 * hex.r) * this.size.height;
    return typeof y !== 'undefined' ?
      new Vector3(x + this.origin.x, y, z + this.origin.z) :
      new Vector2(x + this.origin.x, z + this.origin.z);
  }

  public pixelToHexagon(p: Vector3): Hexagon {
    const pt = new Vector2((p.x - this.origin.x) / this.size.width, (p.y - this.origin.y) / this.size.height);
    const q = this.orientation.b0 * pt.x + this.orientation.b1 * pt.y;
    const r = this.orientation.b2 * pt.x + this.orientation.b3 * pt.y;
    return new Hexagon(q, r, -q - r);
  }

  public cornerOffset(corner: number, y?: number): Vector3 | Vector2 {
    const angle = 2.0 * Math.PI * (this.orientation.startAngle + corner) / 6;
    return typeof y !== 'undefined' ?
      new Vector3(this.size.width * Math.cos(angle), y, this.size.height * Math.sin(angle)) :
      new Vector2(this.size.width * Math.cos(angle), this.size.height * Math.sin(angle));
  }

  public polygonCorners(hex: Hexagon): Vector2[] {
    let corners = [];
    const center = this.hexagonToPixel(hex);
    for (let i = 0; i < 7; i++) {
      const offset = this.cornerOffset(i);
      corners.push(new Vector2(center.x + offset.x, center.y + offset.y));
    }
    return corners;
  }

  public randomInside(hex: Hexagon, y: number): Vector3 {
    if (!(Math.randomBetween(0, 3 * this.size.width * this.size.height) << 0))
      return new Vector3(0, 0, 0);
    let t = Math.randomBetween(0, 2) << 0;
    let v1 = HexagonLayout.RHOMBUSES[t];
    let v2 = HexagonLayout.RHOMBUSES[(t + 1) % 3];
    let x = Math.randomBetween(0, this.size.width - 1) * 0.85;
    let z = Math.randomBetween(0, this.size.height - 1) * 0.85;
    return new Vector3(x * v1.x + z * v2.x, y, x * v1.y + z * v2.y);
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IHexagonLayout | string): HexagonLayout {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? HexagonLayout.fromJSON(value) : value;
      });
    } else if (json) {
      return Object.assign(Object.create(HexagonLayout.prototype), json, {
        orientation: HexagonOrientation.fromJSON(json.orientation),
        size: new Size(json.size.width, json.size.height),
        origin: new Vector3(json.origin.x, json.origin.y, json.origin.z),
      });
    }
  }
}
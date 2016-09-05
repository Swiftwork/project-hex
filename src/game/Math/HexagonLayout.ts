import { Vector2, Vector3 } from 'babylonjs';
import Hexagon from './Hexagon';

//------------------------------------------------------------------------------------
// ORIENTATION
//------------------------------------------------------------------------------------

export class HexagonOrientation {
	constructor(
		public f0: number, public f1: number, public f2: number, public f3: number, 
		public b0: number, public b1: number, public b2: number, public b3: number, 
		public startAngle: number
	) {}
};

//------------------------------------------------------------------------------------
// LAYOUT
//------------------------------------------------------------------------------------

export class HexagonLayout {

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
	  new Vector2(0.5, Math.sqrt(3)/2),
	  new Vector2(0.5, -Math.sqrt(3)/2),
	];

  constructor(
  	private orientation: HexagonOrientation,
  	public size: Vector2,
  	public origin: Vector3
  ) {

  }

  hexagonToPixel(hex: Hexagon, y: number): Vector3 {
    const x = (this.orientation.f0 * hex.q + this.orientation.f1 * hex.r) * this.size.x;
    const z = (this.orientation.f2 * hex.q + this.orientation.f3 * hex.r) * this.size.y;
    return new Vector3(x + this.origin.x, y, z + this.origin.z);
	}

	pixelToHexagon(p: Vector3): Hexagon {
    const pt = new Vector2((p.x - this.origin.x) / this.size.x, (p.y - this.origin.y) / this.size.y);
    const q = this.orientation.b0 * pt.x + this.orientation.b1 * pt.y;
    const r = this.orientation.b2 * pt.x + this.orientation.b3 * pt.y;
    return new Hexagon(q, r, -q - r);
	}

	cornerOffset(corner: number, z: number): Vector3 {
  	const angle = 2.0 * Math.PI * (this.orientation.startAngle + corner) / 6;
    return new Vector3(this.size.x * Math.cos(angle), this.size.y * Math.sin(angle), z);
	}

	polygonCorners(hex: Hexagon): Vector3[] {
		let corners = [];
		const center = this.hexagonToPixel(hex, 0);
	  for (let i = 0; i < 7; i++) {
	    const offset = this.cornerOffset(i, 0);
	    corners.push(new Vector3(center.x + offset.x, center.y + offset.y, 0));
	  }
  	return corners;
	}

	randomInside(hex: Hexagon, y: number): Vector3 {
	  if (!(Math.randomBetween(0, 3 * this.size.x * this.size.y) << 0))
	    return new Vector3(0, 0, 0);
	  let t = Math.randomBetween(0, 2) << 0;
	  let v1 = HexagonLayout.RHOMBUSES[t];
	  let v2 = HexagonLayout.RHOMBUSES[(t + 1) % 3];
	  let x = Math.randomBetween(0, this.size.x - 1) * 0.85;
	  let z = Math.randomBetween(0, this.size.y - 1) * 0.85;
	  return new Vector3(x * v1.x + z * v2.x, y, x * v1.y + z * v2.y);
	}
}
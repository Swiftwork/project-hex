import Hash from '../Utils/Hash';

export default class Hexagon {

	constructor(
		public q: number,
		public r: number,
		public s: number
	) {
		if (typeof s === 'undefined')
			this.s = s = -q - r;
		console.assert(q + r + s == 0, 'Coordinates (Q, R, S) must amount to 0');
	}

	toString(): string {
		return `${this.q}|${this.r}|${this.s}`;
	}

	/* EQUALS */
	equal(hex: Hexagon): boolean {
    return this.q == hex.q && this.r == hex.r && this.s == hex.s;
	}

	/* ADD */
	add(hex: Hexagon): Hexagon {
    return new Hexagon(this.q + hex.q, this.r + hex.r, this.s + hex.s);
	}

	/* SUBTRACT */
	subtract(hex: Hexagon): Hexagon {
	    return new Hexagon(this.q - hex.q, this.r - hex.r, this.s - hex.s);
	}

	/* MULTIPLY */
	multiply(hex: Hexagon): Hexagon {
	    return new Hexagon(this.q * hex.q, this.r * hex.r, this.s * hex.s);
	}

	/* SCALE */
	scale(k: number): Hexagon {
	    return new Hexagon(this.q * k, this.r * k, this.s * k);
	}

	/* DISTANCE */
	distance(hex: Hexagon): number {
		let distance = this.subtract(hex);
    return (Math.abs(distance.q) + Math.abs(distance.r) + Math.abs(distance.s)) / 2;
	}

	/* NEIGHBOR */
	neighbor(direction: number): Hexagon {
	  return hexagonDirections[(6 + (direction % 6)) % 6];
	}
}

export const hexagonDirections = [
  new Hexagon(1, 0, -1), new Hexagon(1, -1, 0), new Hexagon(0, -1, 1), 
  new Hexagon(-1, 0, 1), new Hexagon(-1, 1, 0), new Hexagon(0, 1, -1),
];
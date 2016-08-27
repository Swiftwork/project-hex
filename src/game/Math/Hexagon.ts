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
	equal(a: Hexagon, b: Hexagon): boolean {
    return a.q == b.q && a.r == b.r && a.s == b.s;
	}

	/* ADD */
	add(a: Hexagon, b: Hexagon): Hexagon {
    return new Hexagon(a.q + b.q, a.r + b.r, a.s + b.s);
	}

	/* SUBTRACT */
	subtract(a: Hexagon, b: Hexagon): Hexagon {
	    return new Hexagon(a.q - b.q, a.r - b.r, a.s - b.s);
	}

	/* MULTIPLY */
	multiply(a: Hexagon, k: number): Hexagon {
	    return new Hexagon(a.q * k, a.r * k, a.s * k);
	}

	/* LENGTH */
	length(hex: Hexagon): number {
    return (Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2;
	}

	/* DISTANCE */
	distance(a: Hexagon, b: Hexagon): number {
    return this.length(this.subtract(a, b));
	}

	/* DIRECTION */
	direction(direction: number): Hexagon {
	  return hexagonDirections[(6 + (direction % 6)) % 6];
	}

	/* NEIGHBOR */
	neighbor(hex: Hexagon, direction: number): Hexagon {
	  return this.add(hex, this.direction(direction));
	}
}

export const hexagonDirections = [
  new Hexagon(1, 0, -1), new Hexagon(1, -1, 0), new Hexagon(0, -1, 1), 
  new Hexagon(-1, 0, 1), new Hexagon(-1, 1, 0), new Hexagon(0, 1, -1),
];
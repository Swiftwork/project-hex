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

	/* A string ID for this Hexagon */
	toString(): string {
		return `(${this.q}, ${this.r}, ${this.s})`;
	}

	/* Unique hash value based on Q and R coordinates */
	hash(): number {
		const h1 = this.q >= 0 ? 2 * this.q : -2 * this.q - 1;
    const h2 = this.r >= 0 ? 2 * this.r : -2 * this.r - 1;
    const h3 = (h1 >= h2 ? h1 * h1 + h1 + h2 : h1 + h2 * h2) / 2;
    return this.q < 0 && this.r < 0 || this.q >= 0 && this.r >= 0 ? h3 : -h3 - 1;
	}

	/* Compare this to another Hexagon, returning a new Hexagon */
	equal(hex: Hexagon): boolean {
    return this.q == hex.q && this.r == hex.r && this.s == hex.s;
	}

	/* Add another Hexagon to this Hexagon, returning a new Hexagon */
	add(hex: Hexagon): Hexagon {
    return new Hexagon(this.q + hex.q, this.r + hex.r, this.s + hex.s);
	}

	/* Subtract another Hexagon from this Hexagon, returning a new Hexagon */
	subtract(hex: Hexagon): Hexagon {
	    return new Hexagon(this.q - hex.q, this.r - hex.r, this.s - hex.s);
	}

	/* Multiply another Hexagon with this Hexagon, returning a new Hexagon */
	multiply(hex: Hexagon): Hexagon {
	    return new Hexagon(this.q * hex.q, this.r * hex.r, this.s * hex.s);
	}

	/* Scale each coordinate of this Hexagon by a constant, returning a new Hexagon */
	scale(k: number): Hexagon {
	    return new Hexagon(this.q * k, this.r * k, this.s * k);
	}

	/* Calculate distance to another Hexagon from this Hexagon, returning a number */
	distance(hex: Hexagon): number {
		let distance = this.subtract(hex);
    return (Math.abs(distance.q) + Math.abs(distance.r) + Math.abs(distance.s)) / 2;
	}

	/* Caclulate neighbor based on directional number [1-6], returning a new Hexagon */
	neighbor(direction: number): Hexagon {
	  return hexagonDirections[(6 + (direction % 6)) % 6];
	}
}

export const hexagonDirections = [
  new Hexagon(1, 0, -1), new Hexagon(1, -1, 0), new Hexagon(0, -1, 1), 
  new Hexagon(-1, 0, 1), new Hexagon(-1, 1, 0), new Hexagon(0, 1, -1),
];
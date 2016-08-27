export default class Seed {

	private seed: number;

	constructor(seed: any) {
		this.setSeed(seed);
	}

	public random() {
		return (11 * this.seed + 17) % 25 / 25;
	}

	public getSeed(): number {
		return this.seed;
	}

	public setSeed(seed: any) {
		this.seed = this.charsToInt(seed);
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
}
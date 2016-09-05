import 'core-js/es6';

/* Extend Math */
declare global {
	interface Math {
		randomBetween(min: number, max: number): number
	}
}

Math.randomBetween = function(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
};

/* Extend Array */
declare global {
	interface Array<T> {
		random(seed?: number): T;
	}
}

Array.prototype.random = function<T>(seed?: number): T {
	seed = Math.abs(seed) || Math.random();
	seed = seed <= 1 ? seed * this.length : seed % this.length;
	seed <<= 0;
	return this[seed];
}
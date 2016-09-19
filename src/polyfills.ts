import 'core-js/es6';

Math.randomBetween = function(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
};

Array.prototype.random = function<T>(seed?: number): T {
	seed = seed || Math.random() * 100;
	seed = seed % this.length;
	seed = seed << 0;
	return this[Math.abs(seed)];
}
import 'core-js/es6';
import 'core-js/shim';

Math.randomBetween = function (min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
};

Math.clamp = function (value: number, min: number, max: number): number {
  return this.max(min, this.min(value, max));
};

Math.lerp = function (min: number, max: number, alpha: number): number {
  return min * (1 - alpha) + max * alpha;
};

Array.prototype.random = function <T>(seed?: number): T {
  seed = seed || Math.random() * 100;
  seed = seed % this.length;
  seed = seed << 0;
  return this[Math.abs(seed)];
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

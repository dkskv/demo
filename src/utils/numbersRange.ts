import { clamp } from "ramda";

export class NumbersRange implements Iterable<number> {
  static createByDelta(start: number, delta: number) {
    return new NumbersRange(start, start + delta);
  }

  static infinite() {
    return new NumbersRange(-Infinity, Infinity);
  }

  static endless(start: number) {
    return new NumbersRange(start, Infinity);
  }

  static normalizationBounds() {
    return new NumbersRange(0, 1);
  }

  constructor(public start: number, public end: number) {}

  get delta() {
    return this.end - this.start;
  }

  get size() {
    return Math.abs(this.delta);
  }

  get direction() {
    return Math.sign(this.delta);
  }

  setStart(value: number) {
    return new NumbersRange(value, this.end);
  }

  setEnd(value: number) {
    return new NumbersRange(this.start, value);
  }

  shift(offset: number) {
    return this.map((n) => n + offset);
  }

  constrainSize(bounds: NumbersRange) {
    const delta = bounds.clampNumber(this.delta);

    return NumbersRange.createByDelta(this.start, delta);
  }

  clipInner(inner: NumbersRange) {
    return inner.map((a) => clamp(this.start, this.end, a));
  }

  clampInner({ start, delta }: NumbersRange) {
    return NumbersRange.createByDelta(
      clamp(this.start, this.end - delta, start),
      delta
    );
  }

  clampNumber(n: number) {
    return clamp(this.start, this.end, n);
  }

  /** Вернуть реальную позицию числа, нормированного внутри диапазона */
  denormalizeNumber(n: number) {
    return this.start + n * this.delta;
  }

  /** Нормировать точку внутри диапазона */
  normalizeNumber(n: number) {
    return (n - this.start) / this.delta;
  }

  /** Изменить размер в k раз */
  scale(k: number) {
    const offset = this.size * k;
    return new NumbersRange(this.start + offset, this.end - offset);
  }

  /** Разместить в точке */
  moveTo(x: number, origin = 0) {
    return this.shift(x - this.denormalizeNumber(origin));
  }

  isEqual({ start, end }: NumbersRange) {
    return this.start === start && this.end === end;
  }

  map(f: (a: number) => number) {
    return new NumbersRange(f(this.start), f(this.end));
  }

  *[Symbol.iterator]() {
    yield this.start;
    yield this.end;
  }
}

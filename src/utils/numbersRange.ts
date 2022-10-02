import { clamp } from "ramda";

export class NumbersRange implements Iterable<number> {
  static byDelta(start: number, delta: number) {
    return new NumbersRange(start, start + delta);
  }

  static byOnlyDelta(delta: number) {
    return NumbersRange.byDelta(0, delta);
  }

  static infinite() {
    return new NumbersRange(-Infinity, Infinity);
  }

  static endless() {
    return NumbersRange.byOnlyDelta(Infinity);
  }

  static normalizationBounds() {
    return NumbersRange.byOnlyDelta(1);
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

  get min() {
    return Math.min(this.start, this.end);
  }

  get max() {
    return Math.max(this.start, this.end);
  }

  sortAsc() {
    return new NumbersRange(this.min, this.max);
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
    return NumbersRange.byDelta(this.start, delta);
  }

  clipInner(inner: NumbersRange) {
    return inner.map((a) => clamp(this.start, this.end, a));
  }

  clampInner({ start, delta }: NumbersRange) {
    return NumbersRange.byDelta(
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
    return NumbersRange.byDelta(this.start, this.delta * k);
  }

  invert() {
    return new NumbersRange(this.end, this.start);
  }

  /** Разместить в точке */
  moveTo(x: number, origin = 0) {
    return this.shift(x - this.denormalizeNumber(origin));
  }

  includes(x: number) {
    return this.start <= x && x <= this.end;
  }

  isEdge(x: number) {
    return x === this.start || x === this.end;
  }

  expandEvenly(value: number) {
    return new NumbersRange(this.start - value, this.end + value);
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

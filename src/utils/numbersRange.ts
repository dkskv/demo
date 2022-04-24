import { clamp } from "ramda";

export class NumbersRange implements Iterable<number> {
  static createBySize(start: number, size: number) {
    return new NumbersRange(start, start + size);
  }

  static infinite() {
    return new NumbersRange(-Infinity, Infinity);
  }

  static endless(start: number) {
    return new NumbersRange(start, Infinity);
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

  shiftStart(offset: number) {
    return this.setStart(this.start + offset);
  }

  shiftEnd(offset: number) {
    return this.setEnd(this.end + offset);
  }

  setStart(value: number) {
    return new NumbersRange(value, this.end);
  }

  setEnd(value: number) {
    return new NumbersRange(this.start, value);
  }

  /** Ограничить начало, опираясь на конец и длину диапазона */
  constrainStart({ start: minSize, end: maxSize }: NumbersRange) {
    return this.setStart(
      clamp(this.end - maxSize, this.end - minSize, this.start)
    );
  }

  /** Ограничить конец, опираясь на начало и длину диапазона */
  constrainEnd({ start: minSize, end: maxSize }: NumbersRange) {
    return this.setEnd(
      clamp(this.start + minSize, this.start + maxSize, this.end)
    );
  }

  clipInner(inner: NumbersRange) {
    return inner.map((a) => clamp(this.start, this.end, a));
  }

  clampInner({ start, size }: NumbersRange) {
    return NumbersRange.createBySize(clamp(this.start, this.end - size, start), size);
  }

  map(f: (item: number) => number) {
    return new NumbersRange(f(this.start), f(this.end));
  }

  *[Symbol.iterator]() {
    yield this.start;
    yield this.end;
  }
}

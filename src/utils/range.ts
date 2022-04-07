import { clamp } from "ramda";

export class Range {
  static createBySize(start: number, size: number) {
    return new Range(start, start + size);
  }

  static infinite() {
    return new Range(-Infinity, Infinity);
  }

  static endless(start: number) {
    return new Range(start, Infinity);
  }

  constructor(public start: number, public end: number) {}

  get size() {
    return this.end - this.start;
  }

  shiftStart(offset: number) {
    return this.setStart(this.start + offset);
  }

  shiftEnd(offset: number) {
    return this.setEnd(this.end + offset);
  }

  setStart(value: number) {
    return new Range(value, this.end);
  }

  setEnd(value: number) {
    return new Range(this.start, value);
  }

  constrainStart({ start: minSize, end: maxSize }: Range) {
    return this.setStart(
      clamp(this.end - maxSize, this.end - minSize, this.start)
    );
  }

  constrainEnd({ start: minSize, end: maxSize }: Range) {
    return this.setEnd(
      clamp(this.start + minSize, this.start + maxSize, this.end)
    );
  }

  clipInner(inner: Range) {
    return inner.map((a) => clamp(this.start, this.end, a));
  }

  clampInner({ start, size }: Range) {
    return Range.createBySize(clamp(this.start, this.end - size, start), size);
  }

  map(f: (item: number) => number) {
    return new Range(f(this.start), f(this.end));
  }
}

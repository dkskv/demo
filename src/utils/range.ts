import { clamp } from "ramda";
import { Bounds } from "./bounds";

export class Range {
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

  constrainStart({ min: minSize, max: maxSize }: Bounds) {
    return this.setStart(
      clamp(this.end - maxSize, this.end - minSize, this.start)
    );
  }

  constrainEnd({ min: minSize, max: maxSize }: Bounds) {
    return this.setEnd(
      clamp(this.start + minSize, this.start + maxSize, this.end)
    );
  }

  map(f: (item: number) => number) {
    return new Range(f(this.start), f(this.end));
  }
}

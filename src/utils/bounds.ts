export class Bounds {
  static without() {
    return new Bounds(-Infinity, Infinity);
  }

  static positives() {
    return new Bounds(0, Infinity);
  }

  constructor(public min: number, public max: number) {
      if (min > max) {
          throw new Error("Минимальное значение больше максимального");
      }
  }

  get between() {
      return this.max - this.min;
  }

  map(f: (a: number) => number) {
    return new Bounds(f(this.min), f(this.max));
  }
}

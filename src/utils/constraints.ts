// todo: возможно, лучше переименовать в Bounds
export class Constraints {
  static without() {
    return new Constraints(-Infinity, Infinity);
  }

  static positives() {
    return new Constraints(0, Infinity);
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
    return new Constraints(f(this.min), f(this.max));
  }
}

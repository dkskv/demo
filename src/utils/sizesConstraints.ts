import { Constraints } from "./constraints";

// todo: лучше конкретизировать до BoxSizesConstraints
export class SizesConstraints {
  static without() {
    return new SizesConstraints();
  }

  static positives() {
    return new SizesConstraints(0, undefined, 0, undefined);
  }

  static onlyWidth(minW: number, maxW: number) {
    return new SizesConstraints(minW, maxW);
  }

  static onlyHeight(minH: number, maxH: number) {
    return new SizesConstraints(undefined, undefined, minH, maxH);
  }

  static onlyMin(minW: number, minH: number) {
    return new SizesConstraints(minW, undefined, minH, undefined);
  }

  static onlyMax(maxW: number, maxH: number) {
    return new SizesConstraints(undefined, maxW, undefined, maxH);
  }

  constructor(
    public minW = -Infinity,
    public maxW = Infinity,
    public minH = -Infinity,
    public maxH = Infinity
  ) {}

  /** @deprecated */
  get width(): Constraints {
    return new Constraints(this.minW, this.maxW);
  }

  /** @deprecated */
  get height(): Constraints {
    return new Constraints(this.minH, this.maxH);
  }
}

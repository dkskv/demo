import { Bounds } from "./bounds";

// todo: лучше конкретизировать до BoxSizesBounds
export class BoxSizesBounds {
  static without() {
    return new BoxSizesBounds();
  }

  static positives() {
    return new BoxSizesBounds(0, undefined, 0, undefined);
  }

  static onlyWidth(minW: number, maxW: number) {
    return new BoxSizesBounds(minW, maxW);
  }

  static onlyHeight(minH: number, maxH: number) {
    return new BoxSizesBounds(undefined, undefined, minH, maxH);
  }

  static onlyMin(minW: number, minH: number) {
    return new BoxSizesBounds(minW, undefined, minH, undefined);
  }

  static onlyMax(maxW: number, maxH: number) {
    return new BoxSizesBounds(undefined, maxW, undefined, maxH);
  }

  constructor(
    public minW = -Infinity,
    public maxW = Infinity,
    public minH = -Infinity,
    public maxH = Infinity
  ) {}

  /** @deprecated */
  get width(): Bounds {
    return new Bounds(this.minW, this.maxW);
  }

  /** @deprecated */
  get height(): Bounds {
    return new Bounds(this.minH, this.maxH);
  }
}

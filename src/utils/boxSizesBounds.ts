import { NumbersRange } from "./numbersRange";

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

  get width(): NumbersRange {
    return new NumbersRange(this.minW, this.maxW);
  }

  get height(): NumbersRange {
    return new NumbersRange(this.minH, this.maxH);
  }
}

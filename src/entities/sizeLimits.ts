import { NumbersRange } from "./numbersRange";

export class SizeLimits {
  constructor(
    public dxLimits: NumbersRange = NumbersRange.infinite(),
    public dyLimits: NumbersRange = NumbersRange.infinite()
  ) {}

  denormalize(dx: number, dy: number) {
    return new SizeLimits(
      this.dxLimits.map((a) => a * dx),
      this.dyLimits.map((a) => a * dy)
    );
  }
}

import { NumbersRange } from "./numbersRange";

export class SizeBounds {
  constructor(
    public dxBounds: NumbersRange = NumbersRange.infinite(),
    public dyBounds: NumbersRange = NumbersRange.infinite()
  ) {}

  denormalize(dx: number, dy: number) {
    return new SizeBounds(
      this.dxBounds.map((a) => a * dx),
      this.dyBounds.map((a) => a * dy)
    );
  }
}

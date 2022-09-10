import { denormalize } from "./normalization";
import { NumbersRange } from "./numbersRange";

export class SizeBounds {
  constructor(
    public dxBounds: NumbersRange = NumbersRange.infinite(),
    public dyBounds: NumbersRange = NumbersRange.infinite()
  ) {}

  denormalize(dx: number, dy: number) {
    return new SizeBounds(
      denormalize(this.dxBounds, dx),
      denormalize(this.dyBounds, dy)
    );
  }
}

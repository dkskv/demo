import { NumbersRange } from "../../../entities/numbersRange";

export class ScrollConstraints {
  constructor(
    private scrollLength: number,
    private extrusionZoneLength: number
  ) {}

  public get bounds() {
    return NumbersRange.byOnlyDelta(this.scrollLength);
  }

  public get overflowBounds() {
    return this.bounds.expandEvenly(this.extrusionZoneLength);
  }

  public get startExtrusionZone() {
    return NumbersRange.byDelta(
      -this.extrusionZoneLength,
      this.extrusionZoneLength
    );
  }

  public get endExtrusionZone() {
    return NumbersRange.byDelta(this.scrollLength, this.extrusionZoneLength);
  }
}

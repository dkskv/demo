import { minBy } from "ramda";
import { NumbersRange } from "../../utils/numbersRange";

export class ScrollingState {
  private readonly friction = 0.03;
  private readonly extrusion = 0.05;

  constructor(
    public coordinate: number,
    private constraints: ScrollConstraints,
    public impulse: number
  ) {
    if (!constraints.overflowBounds.includes(coordinate)) {
      this.impulse = 0;
      this.coordinate = constraints.overflowBounds.clampNumber(coordinate);
    }
  }

  public reset() {
    return new ScrollingState(0, this.constraints, 0);
  }

  public setConstraints(a: ScrollConstraints) {
    return new ScrollingState(this.coordinate, a, this.impulse);
  }

  public setImpulse(a: number) {
    return new ScrollingState(this.coordinate, this.constraints, a);
  }

  public suppressEscapeImpulse() {
    const { overflowK } = this;

    if (overflowK === 0 || !this.isTendEscape) {
      return this;
    }

    return this.setImpulse(this.impulse * (1 - overflowK));
  }

  private get isTendEscape() {
    return (
      (this.coordinate < this.constraints.bounds.start && this.impulse < 0) ||
      (this.coordinate > this.constraints.bounds.end && this.impulse > 0)
    );
  }

  private get overflowK() {
    const { coordinate, constraints } = this;

    return coordinate < constraints.bounds.start
      ? 1 - constraints.startExtrusionZone.normalizeNumber(coordinate)
      : coordinate > constraints.bounds.end
      ? constraints.endExtrusionZone.normalizeNumber(coordinate)
      : 0;
  }

  private transmitImpulse(a: number) {
    return this.setImpulse(this.impulse + a);
  }

  public moveByImpulse() {
    const velocity = this.impulse / 1;
    return new ScrollingState(
      this.coordinate + velocity,
      this.constraints,
      this.impulse
    );
  }

  public doInertialMove(dt: number) {
    const environmentImpulse =
      this.calcExtrusionImpulse(dt) + this.calcBrakingImpulse(dt);

    const nextState = this.transmitImpulse(environmentImpulse).moveByImpulse();

    const isLeaveExtrusionZone =
      this.inExtrusionZone && !nextState.inExtrusionZone;

    return isLeaveExtrusionZone
      ? new ScrollingState(
          this.constraints.bounds.clampNumber(this.coordinate),
          this.constraints,
          0
        )
      : nextState;
  }

  public isActive() {
    return this.impulse !== 0 || this.inExtrusionZone;
  }

  public get inExtrusionZone() {
    return !this.constraints.bounds.includes(this.coordinate);
  }

  private calcBrakingImpulse(dt: number) {
    return minBy(
      Math.abs,
      -this.impulse,
      Math.sign(this.impulse) * -this.friction * dt
    );
  }

  private calcExtrusionImpulse(dt: number) {
    return (
      dt *
      (this.coordinate < this.constraints.bounds.start
        ? this.extrusion
        : this.coordinate > this.constraints.bounds.end
        ? -this.extrusion
        : 0)
    );
  }
}

export class ScrollConstraints {
  constructor(
    private scrollLength: number,
    private extrusionZoneLength: number
  ) {}

  public get bounds() {
    return new NumbersRange(0, this.scrollLength);
  }

  public get overflowBounds() {
    return this.bounds.expandEvenly(this.extrusionZoneLength);
  }

  public get startExtrusionZone() {
    return NumbersRange.createByDelta(
      -this.extrusionZoneLength,
      this.extrusionZoneLength
    );
  }

  public get endExtrusionZone() {
    return NumbersRange.createByDelta(
      this.scrollLength,
      this.extrusionZoneLength
    );
  }
}

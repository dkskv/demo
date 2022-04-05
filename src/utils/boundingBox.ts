import { clamp } from "ramda";
import { Bounds } from "./bounds";
import { Point } from "./point";
import { Range } from "./range";

export class BoundingBox {
  static createByDimensions(x0: number, y0: number, dx: number, dy: number) {
    return new BoundingBox(x0, x0 + dx, y0, y0 + dy);
  }

  static createByRanges(xRange: Range, yRange: Range) {
    return new BoundingBox(xRange.start, xRange.end, yRange.start, yRange.end);
  }

  constructor(
    public x1: number,
    public x2: number,
    public y1: number,
    public y2: number
  ) {}

  get x0() {
    return this.x1;
  }

  get y0() {
    return this.y1;
  }

  get origin() {
    return new Point(this.x0, this.y0);
  }

  get dx() {
    return this.x2 - this.x1;
  }

  get dy() {
    return this.y2 - this.y1;
  }

  get width() {
    return Math.abs(this.dx);
  }

  get height() {
    return Math.abs(this.dy);
  }

  /** Возвращает диапазон крайних точек проекции на ось `x` */
  get xsRange() {
    return new Range(this.x1, this.x2);
  }

  /** Возвращает диапазон крайних точек проекции на ось `y` */
  get ysRange() {
    return new Range(this.y1, this.y2);
  }

  get center() {
    return new Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  }

  /** @deprecated */ 
  shiftX1(offset: number) {
    return this.setX1(this.x1 + offset);
  }

  /** @deprecated */ 
  shiftX2(offset: number) {
    return this.setX2(this.x2 + offset);
  }

  /** @deprecated */ 
  shiftY1(offset: number) {
    return this.setY1(this.y1 + offset);
  }

  /** @deprecated */ 
  shiftY2(offset: number) {
    return this.setY2(this.y2 + offset);
  }

  setX1(value: number) {
    return new BoundingBox(value, this.x2, this.y1, this.y2);
  }

  setX2(value: number) {
    return new BoundingBox(this.x1, value, this.y1, this.y2);
  }

  setY1(value: number) {
    return new BoundingBox(this.x1, this.x2, value, this.y2);
  }

  setY2(value: number) {
    return new BoundingBox(this.x1, this.x2, this.y1, value);
  }

  clipInner(inner: BoundingBox) {
    return new BoundingBox(
      clamp(this.x1, this.x2, inner.x1),
      clamp(this.x1, this.x2, inner.x2),
      clamp(this.y1, this.y2, inner.y1),
      clamp(this.y1, this.y2, inner.y2)
    );
  }

  clampInner(inner: BoundingBox) {
    return BoundingBox.createByDimensions(
      clamp(this.x1, this.x2 - inner.dx, inner.x0),
      clamp(this.y1, this.y2 - inner.dy, inner.y0),
      inner.dx,
      inner.dy
    );
  }

  constrainX1(widthBounds: Bounds) {
    const { start } = this.xsRange.constrainStart(widthBounds);

    return this.setX1(start);
  }

  constrainX2(widthBounds: Bounds) {
    const { end } = this.xsRange.constrainEnd(widthBounds);

    return this.setX2(end);
  }

  constrainY1(heightBounds: Bounds) {
    const { start } = this.ysRange.constrainStart(heightBounds);

    return this.setY1(start);
  }

  constrainY2(heightBounds: Bounds) {
    const { end } = this.ysRange.constrainEnd(heightBounds);

    return this.setY2(end);
  }

  /** Устанавливает координату левого верхнего угла */
  setOrigin({ x, y }: Point) {
    return BoundingBox.createByDimensions(x, y, this.dx, this.dy);
  }

  moveToOrigin() {
    return BoundingBox.createByDimensions(0, 0, this.dx, this.dy);
  }
}

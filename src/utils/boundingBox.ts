import { clamp } from "ramda";
import { BoxSizesBounds } from "./boxSizesBounds";
import { NumbersRange } from "./numbersRange";
import { Point } from "./point";

export class BoundingBox {
  static createByDimensions(x0: number, y0: number, dx: number, dy: number) {
    return new BoundingBox(x0, x0 + dx, y0, y0 + dy);
  }

  static createByRanges(xRange: NumbersRange, yRange: NumbersRange) {
    return new BoundingBox(xRange.start, xRange.end, yRange.start, yRange.end);
  }

  static nullish() {
    return new BoundingBox(0, 0, 0, 0);
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
    return new NumbersRange(this.x1, this.x2);
  }

  /** Возвращает диапазон крайних точек проекции на ось `y` */
  get ysRange() {
    return new NumbersRange(this.y1, this.y2);
  }

  get center() {
    return new Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
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
    return BoundingBox.createByRanges(
      this.xsRange.clampInner(inner.xsRange),
      this.ysRange.clampInner(inner.ysRange)
    );
  }

  /** Смещает координату левого верхнего угла */
  shift(offsets: Point): BoundingBox {
    return this.moveTo(this.origin.add(offsets));
  }

  /** Устанавливает координату левого верхнего угла */
  moveTo({ x, y }: Point) {
    return BoundingBox.createByDimensions(x, y, this.dx, this.dy);
  }

  /** Перемещаем бокс в начало координат */
  resetOrigin() {
    return BoundingBox.createByDimensions(0, 0, this.dx, this.dy);
  }

  constrainDeltas(bounds: BoxSizesBounds) {
    const dx = clamp(bounds.minW, bounds.maxW, this.dx);
    const dy = clamp(bounds.minH, bounds.maxH, this.dy);

    return BoundingBox.createByDimensions(this.x0, this.y0, dx, dy);
  }

  shiftDeltas(offsetX: number, offsetY: number) {
    return BoundingBox.createByDimensions(
      this.x0,
      this.y0,
      this.dx + offsetX,
      this.dy + offsetY
    );
  }

  get deltasVector() {
    return new Point(this.dx, this.dy);
  }

  /** Получить бокс в координатах относительно переданной точки */
  placeRelatively(origin: Point) {
    return this.moveTo(this.origin.subtract(origin));
  }

  /** Соотношение сторон (ширина / высота) */
  get aspectRatio() {
    return this.dx / this.dy;
  }

  /** Выровнять бокс по переданному соотношению сторон (ширина / высота) */
  setAspectRatio(ratio: number) {
    const dx = Math.min(this.dx, this.dy * ratio);
    const dy = Math.min(this.dy, this.dx / ratio);

    return BoundingBox.createByDimensions(this.x0, this.y0, dx, dy);
  }

  /** Получить координаты точки по ее нормированным координатам внутри бокса */
  denormalizePoint(point: Point): Point {
    return this.origin.add(point.mul(this.deltasVector));
  }
}

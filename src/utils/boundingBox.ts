import { clamp } from "ramda";
import { NumbersRange } from "./numbersRange";
import { Point } from "./point";

export class BoundingBox {
  static square(x0: number, y0: number, a: number) {
    return this.createByDimensions(x0, y0, a, a);
  }

  static fromOrigin(dx: number, dy: number) {
    return BoundingBox.createByDimensions(0, 0, dx, dy);
  }

  static createByDimensions(x0: number, y0: number, dx: number, dy: number) {
    return new BoundingBox(x0, x0 + dx, y0, y0 + dy);
  }

  static createByRanges(xRange: NumbersRange, yRange: NumbersRange) {
    return new BoundingBox(xRange.start, xRange.end, yRange.start, yRange.end);
  }

  static nullish() {
    return new BoundingBox(0, 0, 0, 0);
  }

  static infinite() {
    return new BoundingBox(-Infinity, Infinity, -Infinity, Infinity);
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

  clampByOuter(outer: BoundingBox) {
    return outer.clampInner(this);
  }

  /** Смещает координаты левого верхнего угла */
  shift(offsets: Point): BoundingBox {
    const p = this.origin.add(offsets);

    return BoundingBox.createByDimensions(p.x, p.y, this.dx, this.dy);
  }

  /** Устанавливает координаты бокса */
  moveTo(p: Point, origin = Point.nullish) {
    return this.shift(p.subtract(this.denormalizePoint(origin)));
  }

  /** Перемещаем бокс в начало координат */
  resetOrigin() {
    return BoundingBox.createByDimensions(0, 0, this.dx, this.dy);
  }

  constrainSize(dxBounds: NumbersRange, dyBounds: NumbersRange) {
    const dx = dxBounds.clampNumber(this.dx);
    const dy = dyBounds.clampNumber(this.dy);

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

  scale(k: number) {
    return BoundingBox.createByRanges(
      this.xsRange.scale(k),
      this.ysRange.scale(k)
    );
  }

  /** Определить площадь пересечения двух боксов */
  intersectionArea(box: BoundingBox) {
    const left = Math.max(this.x1, box.x1);
    const bottom = Math.min(this.y2, box.y2);
    const right = Math.min(this.x2, box.x2);
    const top = Math.max(this.y1, box.y1);

    const width = right - left;
    const height = bottom - top;

    if (width < 0 || height < 0) return 0;

    return width * height;
  }

  /** Соотношение сторон (ширина / высота) */
  get aspectRatio() {
    return this.dx / this.dy;
  }

  /** Задать `aspectRatio` */
  setAspectRatio(ratio: number) {
    // Исходя из уравнения: ratio * dy + dy = dx + dy

    const dy = (this.dx + this.dy) / (ratio + 1);
    const dx = ratio * dy;

    return BoundingBox.createByDimensions(this.x0, this.y0, dx, dy);
  }

  /** Нормировать внутренний бокс */
  normalizeInner(inner: BoundingBox): BoundingBox {
    const { xsRange, ysRange } = this;

    return new BoundingBox(
      xsRange.normalizeNumber(inner.x1),
      xsRange.normalizeNumber(inner.x2),
      ysRange.normalizeNumber(inner.y1),
      ysRange.normalizeNumber(inner.y2)
    );
  }

  denormalizeInner(inner: BoundingBox): BoundingBox {
    const { xsRange, ysRange } = this;

    return new BoundingBox(
      xsRange.denormalizeNumber(inner.x1),
      xsRange.denormalizeNumber(inner.x2),
      ysRange.denormalizeNumber(inner.y1),
      ysRange.denormalizeNumber(inner.y2)
    );
  }

  /** Нормировать координаты точки внутри бокса */
  normalizePoint(point: Point): Point {
    return point.subtract(this.origin).div(this.deltasVector);
  }

  /** Получить координаты точки по ее нормированным координатам внутри бокса */
  denormalizePoint(point: Point): Point {
    return this.origin.add(point.mul(this.deltasVector));
  }

  private get deltasVector() {
    return new Point(this.dx, this.dy);
  }

  placeOutside(box: BoundingBox) {
    return box.shift(this.origin);
  }

  placeInside(box: BoundingBox) {
    const origin = box.origin.subtract(this.origin);

    return box.moveTo(origin);
  }

  isEqual({ x1, x2, y1, y2 }: BoundingBox) {
    return x1 === this.x1 && x2 === this.x2 && y1 === this.y1 && y2 === this.y2;
  }

  map(f: (a: number) => number) {
    return new BoundingBox(f(this.x1), f(this.x2), f(this.y1), f(this.y2));
  }

  /** Разместить в той же точке, что и переданный бокс */
  placeInSameOrigin(box: BoundingBox, normalizedOrigin: Point) {
    const realOrigin = box.denormalizePoint(normalizedOrigin);
    return this.moveTo(realOrigin, normalizedOrigin);
  }
}

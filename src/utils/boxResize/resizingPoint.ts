import { BoundingBox } from "../boundingBox";
import { Point } from "../point";

// todo: переименовать на ResizingHandle
/** Точка, меняющая размеры бокса (координаты точки нормированы) */
export class ResizingPoint extends Point {
  private get mirroredPoint(): Point {
    return this.reflectAroundPoint(new Point(0.5, 0.5));
  }

  /**
   * Получить положение этой точки относительно `origin`:
   *   1  - координата `origin` меньше;
   * (-1) - координата `origin` больше.
   */
  private getSigns(origin: Point): Point {
    return this.subtract(origin).map(Math.sign);
  }

  /**
   * Как изменится бокс, если эта точка (this) сместится в переданные координаты.
   * @param box Бокс, размеры которого нужно изменить
   * @param target Реальные координаты, в которые переместилась эта точка (this)
   * @param origin Точка бокса, остающаяся неподвижной при его трансформировании
   * @returns Трансформированный бокс
   */
  public resizeBox(
    box: BoundingBox,
    target: Point,
    origin = this.mirroredPoint
  ): BoundingBox {
    /** Исходная точка (реальные координаты) */
    const source = box.denormalizePoint(this);

    const signs = this.getSigns(origin);

    /** Вектор перемещения точки */
    const moveVector = target.subtract(source).mul(signs);

    /** Изменение размеров бокса на вектор перемещения */
    return box.shiftDeltas(moveVector.x, moveVector.y);
  }

  /** Переместить бокс в соответствии с `origin` после применения трансформаций */
  public keepTransformOrigin(
    prevBox: BoundingBox,
    nextBox: BoundingBox,
    origin = this.mirroredPoint
  ): BoundingBox {
    /** Исходное значение `origin` (реальные координаты) */
    const prevOrigin = prevBox.denormalizePoint(origin);

    /** Возвращаем `origin` в исходное положение */
    return nextBox.moveTo(prevOrigin, origin);
  }
}

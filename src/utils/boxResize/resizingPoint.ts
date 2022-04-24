import { BoundingBox } from "../boundingBox";
import { Point } from "../point";

/** Точка, меняющая размеры бокса (координаты точки нормированы) */
export class ResizingPoint extends Point {
  /** Точка бокса, остающаяся неподвижной при его трансформировании */
  private get transformOrigin(): Point {
    /* return new Point(0.5, 0.5); */
    return this.reflectAroundPoint(new Point(0.5, 0.5));
  }

  /**
   * Положение этой точки относительно `transformOrigin`:
   *   1  - координата `origin` меньше;
   * (-1) - координата `origin` больше.
   */
  private get signs(): Point {
    return this.subtract(this.transformOrigin).map(Math.sign);
  }

  /**
   * Как изменится бокс, если эта точка (this) сместится в переданные координаты.
   * @param box Бокс, размеры которого нужно изменить
   * @param target Реальные координаты, в которые переместилась эта точка (this)
   * @returns Трансформированный бокс
   */
  public resizeBox(box: BoundingBox, target: Point): BoundingBox {
    /** Исходная точка (реальные координаты) */
    const source = box.denormalizePoint(this);

    /** Вектор перемещения точки */
    const moveVector = target.subtract(source).mul(this.signs);

    /** Изменение размеров бокса на вектор перемещения */
    return box.shiftDeltas(moveVector.x, moveVector.y);
  }

  /** Переместить бокс в соответствии с `transformOrigin` после применения трансформаций */
  public keepTransformOrigin(prevBox: BoundingBox, nextBox: BoundingBox): BoundingBox {
    /** Исходное значение `transformOrigin` (реальные координаты) */
    const prevOrigin = prevBox.denormalizePoint(this.transformOrigin);

    /** Координаты, в которые сместился `transformOrigin` после трансформирования */
    const nextOrigin = nextBox.denormalizePoint(this.transformOrigin);

    /** Вектор смещения `transformOrigin` */
    const originOffset = prevOrigin.subtract(nextOrigin);

    /** Возвращаем `transformOrigin` в исходное положение */
    return nextBox.shift(originOffset);
  }
}

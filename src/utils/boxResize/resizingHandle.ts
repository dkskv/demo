import { BoundingBox } from "../boundingBox";
import { Point } from "../point";

/** Ручка, потянув за которую можно изменить размеры бокса (координаты ручки нормированы) */
export class ResizingHandle extends Point {
  public get mirroredPoint(): Point {
    return this.reflectAroundPoint(new Point(0.5, 0.5));
  }

  /**
   * Получить положение ручки относительно переданного `origin`:
   *   1  - координата `origin` меньше;
   * (-1) - координата `origin` больше.
   */
  private getSigns(origin: Point): Point {
    return this.subtract(origin).map(Math.sign);
  }

  /**
   * Как изменится бокс, если ручка сместится в переданную точку
   * @param box Бокс, размеры которого нужно изменить
   * @param target Абсолютные координаты, в которые переместилась ручка
   * @param origin Точка бокса, остающаяся неподвижной при его трансформировании
   * @returns Трансформированный бокс
   */
  public resizeBox(
    box: BoundingBox,
    target: Point,
    origin = this.mirroredPoint
  ): BoundingBox {
    const source = box.denormalizePoint(this);
    /** Вектор перемещения ручки */
    const moveVector = target.subtract(source).mul(this.getSigns(origin));

    /** Изменение размеров бокса на вектор перемещения */
    return box.shiftDeltas(moveVector.x, moveVector.y);
  }
}

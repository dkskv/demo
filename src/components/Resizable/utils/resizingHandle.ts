import { BoundingBox } from "../../../entities/boundingBox";
import { Point } from "../../../entities/point";

// todo: подумать над названием
/** Ручка, потянув за которую можно изменить размеры бокса (координаты ручки нормированы) */
export class ResizingHandle extends Point {
  public get mirroredPoint(): Point {
    return this.reflectAroundPoint(new Point(0.5, 0.5));
  }

  /**
   * Получить положение ручки относительно переданного `point`:
   *   1  - координата `point` меньше;
   * (-1) - координата `point` больше.
   */
  private getSignsRelativeTo(point: Point): Point {
    return this.subtract(point).map(Math.sign);
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
    targetPoint: Point,
    origin = this.mirroredPoint
  ): BoundingBox {
    const sourcePoint = box.denormalizePoint(this);
    /** Вектор перемещения ручки */
    const moveVector = targetPoint
      .subtract(sourcePoint)
      .mul(this.getSignsRelativeTo(origin));

    /** Изменение размеров бокса на вектор перемещения */
    return box.addToDeltas(moveVector.x, moveVector.y);
  }
}

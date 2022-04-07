import { BoundingBox } from "../boundingBox";
import { BoxSizesBounds } from "../boxSizesBounds";
import { LineSegment } from "../lineSegment";
import { Point } from "../point";
import { EBoxSide } from "../sides";
import { IMovableSide, MovableSideFactory } from "./movableSide";

interface IUpdateParams {
  /** Обновляемый бокс */
  box: BoundingBox;
  sizesBounds: BoxSizesBounds;
  /** Координаты кнопки, в соответствии с которыи обновить бокс */
  point: Point;
  /** Сохранять ли пропорции */
  isRateably: boolean;
}

/**
 * Перемещаемый элемент бокса. Управляет 1-2 сторонами бокса.
 */
export abstract class MovableElement {
  protected readonly dependentSides: IMovableSide[] = [];

  constructor(dependentSidesKeys: EBoxSide[]) {
    this.dependentSides = dependentSidesKeys.map(MovableSideFactory.getByKey);
  }

  /** @deprecated Точка расположения */
  abstract getPointInBox(box: BoundingBox): Point;

  updateBox({ box, sizesBounds, point }: IUpdateParams): BoundingBox {
    return this.dependentSides.reduce(
      (accBox, side) => side.move(accBox, point, sizesBounds),
      box
    );
  }
}

export class MovableEdge extends MovableElement {
  constructor(dependentSideKey: EBoxSide) {
    super([dependentSideKey]);
  }

  getPointInBox(box: BoundingBox) {
    return this.dependentSides[0].projectPoint(box, box.center);
  }
}

export class MovableCorner extends MovableElement {
  getPointInBox(box: BoundingBox) {
    return this.dependentSides.reduce(
      (point, side) => side.projectPoint(box, point),
      Point.origin
    );
  }

  override updateBox(params: IUpdateParams): BoundingBox {
    if (!params.isRateably) {
      return super.updateBox(params);
    }

    /** 
     * todo: пропорции теряются, если утыкаемся в лимит размера одной из сторон.
     * Но проблема более общая, мы также можем утыкаться в стенку.
     */ 
    // Двигаем точку по диагонали, чтобы сохранить пропорции
    const point = this.getCrossingDiagonal(params.box).projectPoint(
      params.point
    );

    return super.updateBox({ ...params, point });
  }

  /** Получить диагональ бокса, которая пересекает трансформируемую вершину */
  private getCrossingDiagonal(box: BoundingBox): LineSegment {
    const originalPoint = this.getPointInBox(box);
    const mirroredPoint = originalPoint.reflectAroundPoint(box.center);

    return new LineSegment(originalPoint, mirroredPoint);
  }
}

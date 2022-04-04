import { BoundingBox } from "../../utils/boundingBox";
import { EBoxSide } from "../../utils/sides";
import { LineSegment } from "../../utils/lineSegment";
import { Point } from "../../utils/point";
import { SizesConstraints } from "../../utils/sizesConstraints";
import { IMovableSide, MovableSideFactory } from "./movableSide";

interface IUpdateParams {
  /** Обновляемый бокс */
  box: BoundingBox;
  sizesConstraints: SizesConstraints;
  /** Координаты кнопки, в соответствии с которыи обновить бокс */
  point: Point;
  /** Сохранять ли пропорции */
  isRateably: boolean;
}

/**
 * Перемещаемый элемент бокса. Управляет 1-2 сторонами бокса.
 */
export abstract class MovableGroup {
  protected readonly dependentSides: IMovableSide[] = [];

  constructor(private dependentSidesKeys: EBoxSide[]) {
    this.dependentSides = dependentSidesKeys.map(MovableSideFactory.getByKey);
  }

  /** @deprecated */
  get key() {
    return this.dependentSidesKeys;
  }

  get stringKey() {
    return this.dependentSidesKeys.join("-");
  }

  /** @deprecated Точка расположения */
  abstract getPointInBox(box: BoundingBox): Point;

  updateBox({ box, sizesConstraints, point }: IUpdateParams): BoundingBox {
    return this.dependentSides.reduce(
      (accBox, side) => side.move(accBox, point, sizesConstraints),
      box
    );
  }
}

export class MovableEdge extends MovableGroup {
  constructor(dependentSideKey: EBoxSide) {
    super([dependentSideKey]);
  }

  getPointInBox(box: BoundingBox) {
    return this.dependentSides[0].projectPoint(box, box.center);
  }
}

export class MovableCorner extends MovableGroup {
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

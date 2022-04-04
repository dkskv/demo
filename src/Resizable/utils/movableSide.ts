import { BoundingBox } from "../../utils/boundingBox";
import { EBoxSide } from "../../utils/sides";
import { Point } from "../../utils/point";
import { SizesConstraints } from "../../utils/sizesConstraints";

export interface IMovableSide {
  /** Спроецировать произвольную точку на сторону бокса */
  projectPoint(box: BoundingBox, p: Point): Point;
  /** Переместить сторону бокса в координату проекции точки */
  move(
    box: BoundingBox,
    point: Point,
    constraints: SizesConstraints
  ): BoundingBox;
}

/**
 * todo: Для уменьшения количества кода можно выделить супер класс, который бы содержал
 * реализации по параметрам, указанным в сторонах.
 */

export abstract class MovableSideFactory {
  public static getByKey(key: EBoxSide): IMovableSide {
    return MovableSideFactory.sides[key];
  }

  private static LeftSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setX(box.x1);
    },
    move(box: BoundingBox, point: Point, constraints: SizesConstraints) {
      return box.setX1(point.x).constrainX1(constraints.width);
    },
  };

  private static RightSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setX(box.x2);
    },
    move(box: BoundingBox, point: Point, constraints: SizesConstraints) {
      return box.setX2(point.x).constrainX2(constraints.width);
    },
  };

  private static TopSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setY(box.y1);
    },
    move(box: BoundingBox, point: Point, constraints: SizesConstraints) {
      return box.setY1(point.y).constrainY1(constraints.height);
    },
  };

  private static BottomSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setY(box.y2);
    },
    move(box: BoundingBox, point: Point, constraints: SizesConstraints) {
      return box.setY2(point.y).constrainY2(constraints.height);
    },
  };

  private static sides = {
    [EBoxSide.left]: this.LeftSide,
    [EBoxSide.right]: this.RightSide,
    [EBoxSide.top]: this.TopSide,
    [EBoxSide.bottom]: this.BottomSide,
  } as const;
}

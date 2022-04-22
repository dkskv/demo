import { BoundingBox } from "../boundingBox";
import { BoxSizesBounds } from "../boxSizesBounds";
import { Point } from "../point";
import { EBoxSide } from "../sides";


export interface IMovableSide {
  /** Спроецировать произвольную точку на сторону бокса */
  projectPoint(box: BoundingBox, p: Point): Point;
  /** Переместить сторону бокса в координату проекции точки */
  move(
    box: BoundingBox,
    point: Point,
    bounds: BoxSizesBounds
  ): BoundingBox;
}

export abstract class MovableSideFactory {
  public static getByKey(key: EBoxSide): IMovableSide {
    return MovableSideFactory.sides[key];
  }

  private static LeftSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setX(box.x1);
    },
    move(box: BoundingBox, point: Point, bounds: BoxSizesBounds) {
      return box.setX1(point.x).constrainX1(bounds.width);
    },
  };

  private static RightSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setX(box.x2);
    },
    move(box: BoundingBox, point: Point, bounds: BoxSizesBounds) {
      return box.setX2(point.x).constrainX2(bounds.width);
    },
  };

  private static TopSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setY(box.y1);
    },
    move(box: BoundingBox, point: Point, bounds: BoxSizesBounds) {
      return box.setY1(point.y).constrainY1(bounds.height);
    },
  };

  private static BottomSide: IMovableSide = {
    projectPoint(box: BoundingBox, p: Point) {
      return p.setY(box.y2);
    },
    move(box: BoundingBox, point: Point, bounds: BoxSizesBounds) {
      return box.setY2(point.y).constrainY2(bounds.height);
    },
  };

  private static sides = {
    [EBoxSide.left]: this.LeftSide,
    [EBoxSide.right]: this.RightSide,
    [EBoxSide.top]: this.TopSide,
    [EBoxSide.bottom]: this.BottomSide,
  } as const;
}

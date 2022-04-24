import { xprod } from "ramda";
import { Point } from "../point";
import { EBoxSide, IHorizontalBoxSide, IVerticalBoxSide } from "../sides";
import { ResizingPoint } from "./resizingPoint";

export type IEdgeThumbKey = EBoxSide;
export type ICornerThumbKey = `${IVerticalBoxSide}-${IHorizontalBoxSide}`;
export type IResizeThumbKey = IEdgeThumbKey | ICornerThumbKey;

/** Набор предустановленных точек для изменения размера бокса */
class ResizingPointsPreset {
  constructor() {
    this.get = this.get.bind(this);
  }

  get all() {
    return [...this.edges, ...this.corners] as const;
  }

  get edges() {
    return [...this.verticalSides, ...this.horizontalSides] as const;
  }

  get corners() {
    return xprod(this.verticalSides, this.horizontalSides).map(
      ([s1, s2]) => `${s1}-${s2}` as ICornerThumbKey
    );
  }

  private get horizontalSides() {
    return [EBoxSide.top, EBoxSide.bottom] as const;
  }

  private get verticalSides() {
    return [EBoxSide.left, EBoxSide.right] as const;
  }

  get(key: IResizeThumbKey): ResizingPoint {
    const { x, y } = this.isCorner(key)
      ? this.getCornerPoint(key)
      : this.getEdgePoint(key);

    return new ResizingPoint(x, y);
  }

  private getEdgePoint(key: IEdgeThumbKey): Point {
    switch (key) {
      case EBoxSide.left:
        return new Point(0, 0.5);
      case EBoxSide.right:
        return new Point(1, 0.5);
      case EBoxSide.top:
        return new Point(0.5, 0);
      case EBoxSide.bottom:
        return new Point(0.5, 1);
      default:
        throw new Error("Incorrect thumb key");
    }
  }

  private getCornerPoint(key: ICornerThumbKey): Point {
    const [p1, p2] = (
      key.split("-") as [IVerticalBoxSide, IHorizontalBoxSide]
    ).map(this.getEdgePoint);

    return p1.mul(p2).map(Math.round);
  }

  private isCorner(key: IResizeThumbKey): key is ICornerThumbKey {
    return key.includes("-");
  }
}

export const resizingPointsPreset = new ResizingPointsPreset();

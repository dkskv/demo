import { xprod } from "ramda";
import { Point } from "../../../utils/point";
import { EBoxSide } from "../../../utils/boxParams";
import { ResizingHandle } from "./resizingHandle";

type IVerticalBoxSide = EBoxSide.left | EBoxSide.right;
type IHorizontalBoxSide = EBoxSide.top | EBoxSide.bottom;

export type IEdgeHandleKey = EBoxSide;
export type ICornerHandleKey = `${IVerticalBoxSide}-${IHorizontalBoxSide}`;
export type IResizeHandleKey = IEdgeHandleKey | ICornerHandleKey;

/** Набор предустановленных ручек для изменения размера бокса */
class ResizingHandlesPreset {
  constructor() {
    this.get = this.get.bind(this);
  }

  // todo: наверное, лучше всегда держать в памяти
  get all() {
    return [...this.edges, ...this.corners] as const;
  }

  get edges() {
    return [...this.verticalSides, ...this.horizontalSides] as const;
  }

  get corners() {
    return xprod(this.verticalSides, this.horizontalSides).map(
      ([s1, s2]) => `${s1}-${s2}` as ICornerHandleKey
    );
  }

  private get horizontalSides() {
    return [EBoxSide.top, EBoxSide.bottom] as const;
  }

  private get verticalSides() {
    return [EBoxSide.left, EBoxSide.right] as const;
  }

  get(key: IResizeHandleKey) {
    const { x, y } = this.isCorner(key)
      ? this.getCornerPoint(key)
      : this.getEdgePoint(key);

    return new ResizingHandle(x, y);
  }

  private getCornerPoint(key: ICornerHandleKey): Point {
    const [p1, p2] = (
      key.split("-") as [IVerticalBoxSide, IHorizontalBoxSide]
    ).map(this.getEdgePoint);

    return p1.mul(p2).map(Math.round);
  }

  private getEdgePoint(key: IEdgeHandleKey): Point {
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
        throw new Error("Incorrect handle key");
    }
  }

  private isCorner(key: IResizeHandleKey): key is ICornerHandleKey {
    return key.includes("-");
  }
}

export const resizingHandlesPreset = new ResizingHandlesPreset();

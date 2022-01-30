import {
  type ILineSegment,
  type IDimensions,
  type IPoint,
} from "../../utils/geometry";
import {
  clampPointWithLine,
  getOppositeSide,
  getBoxBounds,
  type IVerticalSide,
  type IHorizontalSide,
} from "./geometry";
import { type IClampParams, Thumb } from "./Thumb";

export type ICornerSides = [IVerticalSide, IHorizontalSide];

export class CornerThumb extends Thumb<ICornerSides> {
  private static getRelativePoint(
    [xSide, ySide]: Readonly<ICornerSides>,
    dimensions: IDimensions
  ): IPoint {
    const bounds = getBoxBounds(dimensions);

    return { x: bounds[xSide], y: bounds[ySide] } as IPoint;
  }

  public getRelativePoint(dimensions: IDimensions): IPoint {
    return CornerThumb.getRelativePoint(this.dependentSides, dimensions);
  }

  private getCrossingDiagonal(dimensions: IDimensions) {
    const [a, b] = this.dependentSides;
    const oppositeSides = [getOppositeSide(a), getOppositeSide(b)] as const;

    return [
      this.getRelativePoint(dimensions),
      CornerThumb.getRelativePoint(oppositeSides, dimensions),
    ] as ILineSegment;
  }

  protected clampPoint(params: IClampParams, point: IPoint): IPoint {
    const clampedPoint = super.clampPoint(params, point);

    const { isRateably, boxDimensions } = params;

    if (isRateably) {
      const diagonal = this.getCrossingDiagonal(boxDimensions);

      return clampPointWithLine(diagonal, clampedPoint);
    } else {
      return clampedPoint;
    }
  }
}

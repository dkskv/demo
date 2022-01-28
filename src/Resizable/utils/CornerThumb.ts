import { mergeAll } from "ramda";
import {
  EBoxSides,
  type ILineSegment,
  type IDimensions,
  type IPoint,
} from "../../utils/geometry";
import {
  clampPointWithLine,
  clampPointWithBox,
  getOppositeSide,
  getBoxBounds,
  getSidesBounds,
  type IDimensionsBounds,
  type IBoxBounds,
} from "./geometry";
import { type IClampParams, Thumb } from "./Thumb";

type ISides = [
  EBoxSides.left | EBoxSides.right,
  EBoxSides.top | EBoxSides.bottom
];

export class CornerThumb extends Thumb<ISides> {
  private static getInitialPoint(
    [xSide, ySide]: Readonly<ISides>,
    dimensions: IDimensions
  ): IPoint {
    const bounds = getBoxBounds(dimensions);

    return { x: bounds[xSide], y: bounds[ySide] } as IPoint;
  }

  public getInitialPoint(dimensions: IDimensions): IPoint {
    return CornerThumb.getInitialPoint(this.dependentSides, dimensions);
  }

  private getBoundingBox(
    sidesDimensions: IDimensions,
    dimensionsBounds: IDimensionsBounds
  ) {
    const sidesBounds = getSidesBounds(sidesDimensions, dimensionsBounds);

    return mergeAll(
      this.dependentSides.map((side) => sidesBounds[side])
    ) as IBoxBounds;
  }

  private getCrossingDiagonal(dimensions: IDimensions) {
    const [a, b] = this.dependentSides;
    const oppositeSides = [getOppositeSide(a), getOppositeSide(b)] as const;

    return [
      this.getInitialPoint(dimensions),
      CornerThumb.getInitialPoint(oppositeSides, dimensions),
    ] as ILineSegment;
  }

  protected clampPoint(
    { boxDimensions, dimensionsBounds, isRateably }: IClampParams,
    point: IPoint
  ): IPoint {
    const boundingBox = this.getBoundingBox(boxDimensions, dimensionsBounds);
    const boxedPoint = clampPointWithBox(boundingBox, point);

    if (isRateably) {
      const diagonal = this.getCrossingDiagonal(boxDimensions);

      return clampPointWithLine(diagonal, boxedPoint);
    } else {
      return boxedPoint;
    }
  }
}

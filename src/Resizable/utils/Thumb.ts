import { mergeAll } from "ramda";
import { mergeWithAdd } from "../../utils/common";
import {
  EBoxSides,
  getDimensions,
  getOrigin,
  type IDimensions,
  type IPoint,
  type IPosition,
} from "../../utils/geometry";
import {
  getNormalAxisBySide,
  BoxBoundsConverter,
  type IDimensionsBounds,
} from "./geometry";

export interface IClampParams {
  boxDimensions: IDimensions;
  dimensionsBounds: IDimensionsBounds;
  isRateably: boolean;
}

interface IUpdateParams extends Omit<IClampParams, "boxDimensions"> {
  boxPosition: IPosition;
}

export abstract class Thumb<S extends EBoxSides[] = EBoxSides[]> {
  constructor(protected readonly dependentSides: Readonly<S>) {}

  protected abstract clampPoint(params: IClampParams, point: IPoint): IPoint;

  public abstract getInitialPoint(dimensions: IDimensions): IPoint;

  public get key() {
    return this.dependentSides.join("-");
  }

  public updateBoxPosition(params: IUpdateParams, point: IPoint): IPosition {
    const { boxPosition, ...restParams } = params;

    const origin = getOrigin(boxPosition);
    const boxDimensions = getDimensions(boxPosition);

    const updatedPoint = this.clampPoint(
      { boxDimensions, ...restParams },
      point
    );
    const absoluteUpdatedPoint = mergeWithAdd(updatedPoint, origin);

    // const { x: px, y: py } = absolutePoint;
    // const updatedPart = pick(this.dependentSides, {left: px, right: px, top: py, bottom: py, });

    const updatedPart = mergeAll(
      this.dependentSides.map((side) => ({
        [side]: absoluteUpdatedPoint[getNormalAxisBySide(side)],
      }))
    );

    const { from, to } = BoxBoundsConverter;

    return from({ ...to(boxPosition), ...updatedPart });
  }
}

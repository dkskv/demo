import { clamp, mergeAll } from "ramda";
import { mergeWithAdd } from "../../utils/common";
import {
  EBoxSide,
  getDimensions,
  getOrigin,
  BoxBoundsConverter,
  type IDimensions,
  type IPoint,
  type IPosition,
} from "../../utils/geometry";
import {
  getNormalAxisBySide,
  getSidesBounds,
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

export abstract class Thumb<S extends EBoxSide[] = EBoxSide[]> {
  constructor(protected readonly dependentSides: Readonly<S>) {}

  protected clampPoint(
    { boxDimensions, dimensionsBounds }: IClampParams,
    point: IPoint
  ): IPoint {
    const sidesBounds = getSidesBounds(boxDimensions, dimensionsBounds);
    
    return {
      ...point, 
      ...mergeAll(
        this.dependentSides.map((side) => {
          const { min, max } = sidesBounds[side];
          const axis = getNormalAxisBySide(side);

          return { [axis]: clamp(min, max, point[axis]) };
        })
      ),
    };
  }

  public abstract getRelativePoint(dimensions: IDimensions): IPoint;

  public get key() {
    return this.dependentSides;
  }

  public get stringKey() {
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

    const updatedPart = mergeAll(
      this.dependentSides.map((side) => ({
        [side]: absoluteUpdatedPoint[getNormalAxisBySide(side)],
      }))
    );

    const { from, to } = BoxBoundsConverter;

    return from({ ...to(boxPosition), ...updatedPart });
  }
}

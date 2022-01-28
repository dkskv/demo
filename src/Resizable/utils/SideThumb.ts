import { EBoxSides, type IDimensions, type IPoint } from "../../utils/geometry";
import {
  getAdjacentSides,
  getNormalAxisBySide,
  getBoxBounds,
  getSidesBounds,
} from "./geometry";
import { type IClampParams, Thumb } from "./Thumb";

export class SideThumb extends Thumb {
  private readonly dependentSide: EBoxSides;

  constructor(dependentSide: EBoxSides) {
    super([dependentSide]);
    this.dependentSide = dependentSide;
  }

  public getInitialPoint(dimensions: IDimensions): IPoint {
    const boxBounds = getBoxBounds(dimensions);
    const [s1, s2] = getAdjacentSides(this.dependentSide);

    return {
      [getNormalAxisBySide(this.dependentSide)]: boxBounds[this.dependentSide],
      [getNormalAxisBySide(s1)]: (boxBounds[s1] + boxBounds[s2]) / 2,
    } as unknown as IPoint;
  }

  protected clampPoint(
    { boxDimensions, dimensionsBounds }: IClampParams,
    point: IPoint
  ): IPoint {
    const sidesBounds = getSidesBounds(boxDimensions, dimensionsBounds);

    return point;
  }
}

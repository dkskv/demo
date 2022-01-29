import { EBoxSides, type IDimensions, type IPoint } from "../../utils/geometry";
import {
  getAdjacentSides,
  getNormalAxisBySide,
  getBoxBounds,
} from "./geometry";
import { Thumb } from "./Thumb";

export class SideThumb extends Thumb {
  private readonly dependentSide: EBoxSides;

  constructor(dependentSide: EBoxSides) {
    super([dependentSide]);
    this.dependentSide = dependentSide;
  }

  public getRelativePoint(dimensions: IDimensions): IPoint {
    const boxBounds = getBoxBounds(dimensions);
    const [s1, s2] = getAdjacentSides(this.dependentSide);

    return {
      ...{ x: 0, y: 0 }, // для типизации
      [getNormalAxisBySide(this.dependentSide)]: boxBounds[this.dependentSide],
      [getNormalAxisBySide(s1)]: (boxBounds[s1] + boxBounds[s2]) / 2,
    } as IPoint;
  }
}

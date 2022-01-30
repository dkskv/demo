import { EBoxSide, type IDimensions, type IPoint } from "../../utils/geometry";
import {
  getAdjacentSides,
  getNormalAxisBySide,
  getBoxBounds,
} from "./geometry";
import { Thumb } from "./Thumb";

export class SideThumb<T extends EBoxSide> extends Thumb {
  private readonly dependentSide: T;

  constructor(dependentSide: T) {
    super([dependentSide]);
    this.dependentSide = dependentSide;
  }

  public getRelativePoint(dimensions: IDimensions): IPoint {
    const boxBounds = getBoxBounds(dimensions);
    const sides = getAdjacentSides(this.dependentSide);

    return {
      ...{ x: 0, y: 0 }, // для типизации
      [getNormalAxisBySide(this.dependentSide)]: boxBounds[this.dependentSide],
      [getNormalAxisBySide(sides[0])]: (boxBounds[sides[0]] + boxBounds[sides[1]]) / 2,
    } as IPoint;
  }
}

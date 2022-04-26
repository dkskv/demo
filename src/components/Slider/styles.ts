import { NumbersRange } from "../../utils/numbersRange";
import { IOrientation } from "../../utils/orientation";

export const sliderTrackStyle = (
    orientation: IOrientation,
    { start, end }: NumbersRange,
    /** В процентах */
    thickness = 100,
  ) =>
    ({
      position: "absolute" as const,
      [orientation.cssKeys.normalCoordinate]: 0,
      [orientation.cssKeys.coordinate]: `${start * 100}%`,
      [orientation.cssKeys.length]: `${(end - start) * 100}%`,
      [orientation.cssKeys.thickness]: `${thickness}%`,
    } as const);
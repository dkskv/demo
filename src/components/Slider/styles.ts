import { NumbersRange } from "../../utils/numbersRange";
import { IDirection } from "../../utils/direction";

export const sliderTrackStyle = (
  direction: IDirection,
  { start, end }: NumbersRange,
  /** В процентах */
  thickness = 100
) =>
  ({
    position: "absolute" as const,
    [direction.cssKeys.normalCoordinate]: 0,
    [direction.cssKeys.coordinate]: `${start * 100}%`,
    [direction.cssKeys.length]: `${(end - start) * 100}%`,
    [direction.cssKeys.thickness]: `${thickness}%`,
  } as const);

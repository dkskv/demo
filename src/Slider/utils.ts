import { clamp } from "ramda";
import { IRange } from "../utils/common";
import { denormalize, IDimensions, normalize, type IPosition } from "../utils/geometry";
import { IOrientationAttrs } from "../utils/orientation";

export const Converter = {
  toSliderRange(
    position: IPosition,
    containerDimensions: IDimensions,
    orientation: IOrientationAttrs
  ): IRange {
    const containerLength = containerDimensions[orientation.length];

    const start = position[orientation.coordinate];
    const length = position[orientation.length];

    return normalize({ start, end: start + length }, containerLength);
  },
  toResizablePosition(
    range: IRange,
    containerDimensions: IDimensions,
    orientation: IOrientationAttrs,
    thickness: number
  ): IPosition {
    const containerLength = containerDimensions[orientation.length];
    const { start, end } = denormalize(range, containerLength);

    return {
      [orientation.fixedCoordinate]: 0,
      [orientation.coordinate]: start,
      [orientation.thickness]: thickness,
      [orientation.length]: end - start,
    } as unknown as IPosition;
  },
};

export const sliderTrackStyle = (
  { start, end }: IRange,
  thickness: number,
  orientation: IOrientationAttrs,
) => ({
  position: "absolute" as const,
  [orientation.css.coordinate]: `${start * 100}%`,
  [orientation.css.length]: `${(end - start) * 100}%`,
  [orientation.css.thickness]: `${thickness}px`,
} as const);

export function validateSliderRange(range: IRange) {
  if (
    Object.entries(range).every(([, value]) => value === clamp(0, 1, value))
  ) {
    return;
  }

  if (range.end > range.start) {
    return;
  }

  console.error(`Incorrect arg 'range': ${JSON.stringify(range)}`);
}

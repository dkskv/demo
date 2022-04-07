import { clamp } from "ramda";
import { Range } from "../../utils/range";
import { IOrientation } from "../../utils/orientation";

export function validateSliderRange(range: Range) {
  if (
    Object.entries(range).every(([, value]) => value === clamp(0, 1, value))
  ) {
    return;
  }

  if (range.end >= range.start) {
    return;
  }

  console.error(`Incorrect arg 'range': ${JSON.stringify(range)}`);
}

export const sliderTrackStyle = (
  orientation: IOrientation,
  { start, end }: Range,
  /** В процентах */
  thickness = 100,
) =>
  ({
    position: "absolute" as const,
    [orientation.cssKeys.coordinate]: `${start * 100}%`,
    [orientation.cssKeys.length]: `${(end - start) * 100}%`,
    [orientation.cssKeys.thickness]: `${thickness}%`,
  } as const);

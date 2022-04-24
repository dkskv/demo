import { NumbersRange } from "../../utils/numbersRange";
import { IOrientation } from "../../utils/orientation";

export function validateSliderRange(range: NumbersRange) {
  // todo: добавить проверку на нормализацию

  if (range.end >= range.start) {
    return;
  }

  console.error(`Incorrect arg 'range': ${JSON.stringify(range)}`);
}

export const sliderTrackStyle = (
  orientation: IOrientation,
  { start, end }: NumbersRange,
  /** В процентах */
  thickness = 100,
) =>
  ({
    position: "absolute" as const,
    [orientation.cssKeys.coordinate]: `${start * 100}%`,
    [orientation.cssKeys.length]: `${(end - start) * 100}%`,
    [orientation.cssKeys.thickness]: `${thickness}%`,
  } as const);

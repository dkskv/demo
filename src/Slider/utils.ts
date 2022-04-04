import { clamp } from "ramda";
import { BoundingBox } from "../utils/boundingBox";
import { Range } from "../utils/range";
import { IOrientation } from "../utils/orientation";
import { getElementBoundingBox } from "../utils/dom";

export const Converter = {
  toSliderRange(box: BoundingBox, orientation: IOrientation) {
    return orientation.getRangeOfBox(box);
  },
  toResizableBox(range: Range, thickness: number, orientation: IOrientation) {
    return orientation.getBoxFromRanges(range, new Range(0, thickness));
  },
};

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

export function getTrackOuterBox(track: HTMLElement) {
  if (!track.parentElement) {
    throw new Error("Отсутствует родительский элемент");
  }

  return getElementBoundingBox(track.parentElement);
}

export const sliderTrackStyle = (
  { start, end }: Range,
  thickness: number,
  orientation: IOrientation
) =>
  ({
    position: "absolute" as const,
    [orientation.cssKeys.coordinate]: `${start * 100}%`,
    [orientation.cssKeys.length]: `${(end - start) * 100}%`,
    [orientation.cssKeys.thickness]: `${thickness}px`,
  } as const);

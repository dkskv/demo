import { range } from "ramda";
import { Range } from "../../utils/range";
import { IOrientation } from "../../utils/orientation";

export function rangeInclusive(from: number, to: number) {
  return range(from, to + 1);
}

function fits(x: number, valueOfDivision: number) {
  return Math.floor(x / valueOfDivision);
}

export function getIndexesRange(
  x: number,
  length: number,
  slotSize: number
): Range {
  return new Range(fits(x, slotSize), fits(x + length, slotSize))
}

export function expandEvenly(overscan: number, { start, end }: Range): Range {
  return new Range(start - overscan, end + overscan)
}

export function getViewAreaStyle(
  areaLength: number,
  gutter: number,
  orientation: IOrientation
) {
  return {
    [orientation.cssKeys.length]: `${areaLength}px`,
    [orientation.cssKeys.gap]: `${gutter}px`,
  };
}

export function getItemStyle(
  length: number,
  coordinate: number,
  orientation: IOrientation
) {
  return {
    [orientation.cssKeys.length]: `${length}px`,
    [orientation.cssKeys.coordinate]: `${coordinate}px`,
  }; 
}

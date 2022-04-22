import { range } from "ramda";
import { NumbersRange } from "../../utils/numbersRange";
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
): NumbersRange {
  return new NumbersRange(fits(x, slotSize), fits(x + length, slotSize))
}

export function expandEvenly(overscan: number, { start, end }: NumbersRange): NumbersRange {
  return new NumbersRange(start - overscan, end + overscan)
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

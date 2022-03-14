import { range } from "ramda";
import { IRange } from "../utils/common";
import { IOrientationAttrs } from "../utils/orientation";

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
): IRange {
  return { start: fits(x, slotSize), end: fits(x + length, slotSize) };
}

export function expandEvenly(overscan: number, { start, end }: IRange): IRange {
  return { start: start - overscan, end: end + overscan };
}

export function getViewAreaStyle(
  areaLength: number,
  gutter: number,
  orientation: IOrientationAttrs
) {
  return {
    [orientation.css.length]: `${areaLength}px`,
    [orientation.css.gap]: `${gutter}px`,
  };
}

export function getItemStyle(
  length: number,
  coordinate: number,
  orientation: IOrientationAttrs
) {
  return {
    [orientation.css.length]: `${length}px`,
    [orientation.css.coordinate]: `${coordinate}px`,
  }; 
}

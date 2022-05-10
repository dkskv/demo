import { range } from "ramda";
import { NumbersRange } from "../../utils/numbersRange";

export function getRenderingIndexes(
  bounds: NumbersRange,
  slotSize: number,
  overscanCount: number
): number[] {
  const { start, end } = expandEvenly(bounds, overscanCount);

  return range(fits(start, slotSize), fits(end, slotSize) + 1);
}

// todo: уже не понимаю, зачем нужна эта функция
function fits(x: number, valueOfDivision: number): number {
  return Math.floor(x / valueOfDivision);
}

function expandEvenly(
  { start, end }: NumbersRange,
  overscan: number
): NumbersRange {
  return new NumbersRange(start - overscan, end + overscan);
}
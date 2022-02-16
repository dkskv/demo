import { clamp } from "ramda";
import { getRangeLengthBounds, IBounds, IRange } from "../utils/common";

export function getNextRange(
  range: IRange,
  [key, value]: [keyof IRange, number],
  lengthBounds: IBounds
) {
  const { [key]: bounds } = getRangeLengthBounds(range, lengthBounds);

  return { ...range, [key]: clamp(bounds.min, bounds.max, value) };
}

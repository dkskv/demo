import { IConverter } from "../../decorators/useSmoothControl";
import { NumbersRange } from "../../entities/numbersRange";

/** @param bounds Границы, в которых происходит нормирование */
export const createConverter = (
  bounds: NumbersRange
): IConverter<NumbersRange, NumbersRange> => {
  return {
    normalize(numbersRange: NumbersRange) {
      return numbersRange.map((n) => bounds.normalizeNumber(n));
    },
    denormalize(normalizedRange: NumbersRange) {
      return normalizedRange.map((n) =>
        Math.round(bounds.denormalizeNumber(n))
      );
    },
  };
};

import { IConverter } from "../../utils/converter";
import { NumbersRange } from "../../utils/numbersRange";

/** 
 * Создать конвертер между нормированным диапазоном и диапазон чисел
 * @param bounds Границы, в которых происходит нормирование
 * @returns Конвертер
 */
export const createConverter = (
  bounds: NumbersRange
): IConverter<NumbersRange, NumbersRange> => {
  return {
    toDestination(normalizedRange: NumbersRange) {
      return normalizedRange.map((n) => Math.round(bounds.denormalizeNumber(n)));
    },
    fromDestination(numbersRange: NumbersRange) {
      return numbersRange.map((n) => bounds.normalizeNumber(n));
    },
  };
};

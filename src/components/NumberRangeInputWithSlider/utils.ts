import { identity } from "ramda";
import { NumbersRange } from "../../utils/numbersRange";

/**
 * todo: Вынести в отдельную утилиту двустороннее связывание.
 * И поработать над понятностью.
 */
export interface IConverter<T, U> {
  toUni(x: T): U;
  toSrc(x: U): T;
}

export const identityConverter = { toUni: identity, toSrc: identity };

const getInputConverter = (range: NumbersRange): IConverter<number, number> => ({
  toUni(x: number) {
    return (x - range.start) / range.size;
  },
  toSrc(x: number) {
    return Math.round(range.start + x * range.size);
  },
});

export const getInputsRangeConverter = (
  bounds: NumbersRange
): IConverter<NumbersRange, NumbersRange> => {
  const converter = getInputConverter(bounds);

  return {
    toUni(range: NumbersRange) {
      return range.map(converter.toUni);
    },
    toSrc(range: NumbersRange) {
      return range.map(converter.toSrc);
    },
  };
};

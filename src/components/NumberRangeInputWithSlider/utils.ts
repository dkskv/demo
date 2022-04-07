import { identity } from "ramda";
import { Range } from "../../utils/range";

/**
 * todo: Вынести в отдельную утилиту двустороннее связывание.
 * И поработать над понятностью.
 */
export interface IConverter<T, U> {
  toUni(x: T): U;
  toSrc(x: U): T;
}

export const identityConverter = { toUni: identity, toSrc: identity };

const getInputConverter = (range: Range): IConverter<number, number> => ({
  toUni(x: number) {
    return (x - range.start) / range.size;
  },
  toSrc(x: number) {
    return Math.round(range.start + x * range.size);
  },
});

export const getInputsRangeConverter = (
  bounds: Range
): IConverter<Range, Range> => {
  const converter = getInputConverter(bounds);

  return {
    toUni(range: Range) {
      return range.map(converter.toUni);
    },
    toSrc(range: Range) {
      return range.map(converter.toSrc);
    },
  };
};

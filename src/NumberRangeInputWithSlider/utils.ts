import { identity } from "ramda";
import { Bounds } from "../utils/bounds";
import { Range} from "../utils/range";

/**
 * todo: Вынести в отдельную утилиту двустороннее связывание.
 * И поработать над понятностью.
 */
export interface IConverter<T, U> {
  toUni(x: T): U;
  toSrc(x: U): T;
}

export const identityConverter = { toUni: identity, toSrc: identity };

const getInputConverter = ({
  min,
  max,
}: Bounds): IConverter<number, number> => ({
  toUni(x: number) {
    return (x - min) / (max - min);
  },
  toSrc(x: number) {
    return Math.round(min + x * (max - min));
  },
});

export const getInputsRangeConverter = (
  bounds: Bounds
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

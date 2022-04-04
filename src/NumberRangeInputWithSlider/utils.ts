import { identity } from "ramda";
import { Constraints } from "../utils/constraints";
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
}: Constraints): IConverter<number, number> => ({
  toUni(x: number) {
    return (x - min) / (max - min);
  },
  toSrc(x: number) {
    return Math.round(min + x * (max - min));
  },
});

export const getInputsRangeConverter = (
  bounds: Constraints
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

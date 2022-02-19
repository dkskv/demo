import { identity, mapObjIndexed } from "ramda";
import { IBounds, IRange } from "../utils/common";

// абстрактное о конвертерах вынести отсюдава

export interface IConverter<T, U> {
  toUni(x: T): U;
  toSrc(x: U): T;
}

export const identityConverter = { toUni: identity, toSrc: identity };

const getInputConverter = ({
  min,
  max,
}: IBounds): IConverter<number, number> => ({
  toUni(x: number) {
    return (x - min) / (max - min);
  },
  toSrc(x: number) {
    return Math.round(min + x * (max - min));
  },
});

export const getInputsRangeConverter = (
  bounds: IBounds
): IConverter<IRange, IRange> => {
  const converter = getInputConverter(bounds);

  return {
    toUni(range) {
      return mapObjIndexed(converter.toUni, range);
    },
    toSrc(range) {
      return mapObjIndexed(converter.toSrc, range);
    },
  };
};

export function toSliderLengthBounds(bounds: IBounds, lengthBounds: IBounds) {
  return mapObjIndexed((x) => x / (bounds.max - bounds.min), lengthBounds);
}

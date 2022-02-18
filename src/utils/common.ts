import { is, mergeWith } from "ramda";
export interface IPressedKeys {
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
}

export function mergeWithAdd<A, B>(a: A, b: B) {
  return mergeWith((x, y) => x + y, a, b) as A & B;
}

function joinClassNames(names: string[]) {
  const validNames = names.filter(is(String));

  return validNames.join(" ");
}

export interface IRange {
  start: number; // [0, 1]
  end: number; // [0, 1]
}

export interface IBounds {
  min: number;
  max: number;
}

// У меня есть диапазон значений, я хочу вычислить, как
// может колебаться каждое из значений при заданных
// минимальной и максимальной длине
export function getRangeLengthBounds(
  range: IRange,
  lengthBounds: IBounds
): Record<keyof IRange, IBounds> {
  return {
    start: {
      min: range.end - lengthBounds.max,
      max: range.end - lengthBounds.min,
    },
    end: {
      min: range.start + lengthBounds.min,
      max: range.start + lengthBounds.max,
    },
  };
}

export function getDefaultBounds(bounds: Partial<IBounds> = {}) {
  return { min: -Infinity, max: Infinity, ...bounds };
}
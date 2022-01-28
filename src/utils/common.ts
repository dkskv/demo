import { is, mergeWith } from "ramda";
import { IPosition } from "./geometry";

export interface IPressedKeys {
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
}
export interface IPositionChangeCallback {
  (a: IPosition, keys: IPressedKeys): void;
}

export function mergeWithAdd<A, B>(a: A, b: B) {
  return mergeWith((x, y) => x + y, a, b) as A & B;
}

function joinClassNames(names: string[]) {
  const validNames = names.filter(is(String));

  return validNames.join(" ");
}

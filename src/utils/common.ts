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

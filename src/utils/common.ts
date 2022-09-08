import { curryN } from "ramda";

export interface IPressedKeys {
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
}

export function extractPressedKeys({
  altKey,
  shiftKey,
  ctrlKey,
}: MouseEvent): IPressedKeys {
  return { altKey, shiftKey, ctrlKey };
}

export const noop = () => {};

export const magnetize = curryN(
  2,
  (step: number, n: number) => Math.round(n / step) * step
);

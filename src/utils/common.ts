import { curryN } from "ramda";

export interface IPressedKeys {
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
}

export const noop = () => {};

export const magnetize = curryN(
  2,
  (step: number, n: number) => Math.round(n / step) * step
);

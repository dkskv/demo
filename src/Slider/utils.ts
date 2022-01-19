import { clamp, update } from "ramda";

const boundsAround = (i: number, xs: number[]) =>
  [xs[i - 1] ?? 0, xs[i + 1] ?? 1] as const;

export const normalizeValues = (xs: number[]) =>
  xs.map((x, i) => clampPosition(i, x, xs));

export const clampPosition = (i: number, x: number, positions: number[]) =>
  clamp(...boundsAround(i, positions), x);

export const updatePositions = (i: number, x: number, positions: number[]) =>
  update(i, clampPosition(i, x, positions), positions);


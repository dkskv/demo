import { mapObjIndexed, zipWith } from "ramda";
import { IState } from "./index.types";

const enum EThumbKeys {
  topLeft = "tl",
  topRight = "tr",
  bottomRight = "br",
  bottomLeft = "bl",
}

export function getThumbs(state: IState) {
  const [w, h] = getDimensions(state);

  return [
    { name: EThumbKeys.topLeft, position: [0, 0] },
    { name: EThumbKeys.topRight, position: [w, 0] },
    { name: EThumbKeys.bottomRight, position: [w, h] },
    { name: EThumbKeys.bottomLeft, position: [0, h] },
  ] as const;
}

export function createStateUpdater(
  name: EThumbKeys,
  position: [number, number]
) {
  return function (prevState: readonly [number, number, number, number]) {
    const [x1, y1, x2, y2] = prevState;
    const [x, y] = getOuterPosition([x1, y1], position);

    switch (name) {
      case EThumbKeys.topLeft:
        return [x, y, x2, y2] as const;
      case EThumbKeys.topRight:
        return [x1, y, x, y2] as const;
      case EThumbKeys.bottomRight:
        return [x1, y1, x, y] as const;
      case EThumbKeys.bottomLeft:
        return [x, y1, x2, y] as const;
    }
  };
}

export function getAreaStyle(state: IState) {
  const [width, height] = getDimensions(state);
  const [left, top] = state;

  return mapObjIndexed((a) => `${a}px`, { left, top, width, height });
}

function getOuterPosition(
  origin: [number, number],
  position: [number, number]
) {
  return zipWith((x, y) => x + y, origin, position);
}

function getDimensions([left, top, right, bottom]: IState) {
  const width = right - left;
  const height = bottom - top;

  return [width, height];
}

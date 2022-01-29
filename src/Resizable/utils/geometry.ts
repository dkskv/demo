import { nth } from "ramda";
import {
  EBoxSides,
  type IDimensions,
  type IPosition,
  pointProjection,
} from "../../utils/geometry";

export interface IBoxBounds extends Record<EBoxSides, number> {}

export interface IDimensionsBounds {
  min: IDimensions;
  max: IDimensions;
}

class CircularList<T> {
  constructor(private elements: T[]) {}

  public getByOffset(from: T, offset: number) {
    const i = this.elements.indexOf(from);

    if (~i) {
      return nth((i + offset) % this.elements.length, this.elements)!;
    }

    return from;
  }
}

const sidesCircularList = new CircularList([
  EBoxSides.left,
  EBoxSides.top,
  EBoxSides.right,
  EBoxSides.bottom,
]);

export function getAdjacentSides(side: EBoxSides) {
  return [
    sidesCircularList.getByOffset(side, -1),
    sidesCircularList.getByOffset(side, 1),
  ];
}

export const getNormalAxisBySide = (() => {
  const axises = { left: "x", right: "x", top: "y", bottom: "y" } as const;

  return (side: EBoxSides) => axises[side];
})();

export function getSidesBounds(
  boxDimensions: IDimensions,
  dimensionsBounds: IDimensionsBounds
) {
  const { width: w, height: h } = boxDimensions;
  const {
    min: { width: minW, height: minH },
    max: { width: maxW, height: maxH },
  } = dimensionsBounds;

  return {
    left: { min: w - maxW, max: w - minW },
    right: { min: minW, max: maxW },
    top: { min: h - maxH, max: h - minH },
    bottom: { min: minH, max: maxH },
  };
}

export function getOppositeSide<T extends EBoxSides>(side: T) {
  return sidesCircularList.getByOffset(side, 2) as T;
}

export function getBoxBounds({ width, height }: IDimensions) {
  return {
    left: 0,
    right: width,
    top: 0,
    bottom: height,
  };
}

export const clampPointWithLine = pointProjection;

export const BoxBoundsConverter = {
  from({ left, right, top, bottom }: IBoxBounds): IPosition {
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };
  },
  to({ x, y, width, height }: IPosition): IBoxBounds {
    return {
      left: x,
      top: y,
      right: x + width,
      bottom: y + height,
    };
  },
};

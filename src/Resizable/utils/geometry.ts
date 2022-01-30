import { CircularList } from "../../utils/collections";
import {
  EBoxSide,
  type IDimensions,
  type IPosition,
  pointProjection,
} from "../../utils/geometry";

export type IVerticalSide = EBoxSide.left | EBoxSide.right;
export type IHorizontalSide = EBoxSide.top | EBoxSide.bottom;

export interface IBoxBounds extends Record<EBoxSide, number> {}

export interface IDimensionsBounds {
  min: IDimensions;
  max: IDimensions;
}

const sides = new CircularList([
  EBoxSide.left,
  EBoxSide.top,
  EBoxSide.right,
  EBoxSide.bottom,
]);

export function getAdjacentSides<T extends EBoxSide>(side: T) {
  return [
    sides.nIndexesFrom(-1, side),
    sides.nIndexesFrom(1, side),
  ] as T extends IVerticalSide
    ? [IHorizontalSide, IHorizontalSide]
    : [IVerticalSide, IVerticalSide];
}

export function getOppositeSide<T extends EBoxSide>(side: T) {
  return sides.nIndexesFrom(2, side) as T extends IVerticalSide
    ? IVerticalSide
    : IHorizontalSide;
}

export const getNormalAxisBySide = (() => {
  const axises = { left: "x", right: "x", top: "y", bottom: "y" } as const;

  return <T extends EBoxSide>(side: T) =>
    axises[side] as T extends IVerticalSide ? "x" : "y";
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

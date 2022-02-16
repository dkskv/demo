import { clamp } from "ramda";
import { clampDragInBox } from "../../Draggable/utils/geometry";
import { CircularList } from "../../utils/collections";
import { getRangeLengthBounds, IBounds } from "../../utils/common";
import {
  EBoxSide,
  type IDimensions,
  pointProjection,
  IPosition,
  BoxBoundsConverter,
} from "../../utils/geometry";

export type IVerticalSide = EBoxSide.left | EBoxSide.right;
export type IHorizontalSide = EBoxSide.top | EBoxSide.bottom;

export type IDimensionsBounds = Record<keyof IDimensions, IBounds>;

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
  // мб функцию, переводящую диапазон в зависимости от ориентации оси
  const { start: left, end: right } = getRangeLengthBounds(
    { start: 0, end: boxDimensions.width },
    dimensionsBounds.width
  );
  const { start: top, end: bottom } = getRangeLengthBounds(
    { start: 0, end: boxDimensions.height },
    dimensionsBounds.height
  );

  return { left, right, top, bottom };
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

export function clampResizeInBox(
  boxDimensions: IDimensions,
  position: IPosition
) {
  const { width, height } = boxDimensions;

  const { from, to } = BoxBoundsConverter;
  const { left, right, top, bottom } = to(position);

  return from({
    left: clamp(0, width, left),
    right: clamp(0, width, right),
    top: clamp(0, height, top),
    bottom: clamp(0, height, bottom),
  });
}

export function clampInBox(
  boxDimensions: IDimensions,
  position: IPosition,
  isDrag: boolean
): IPosition {
  const clamper = isDrag ? clampDragInBox : clampResizeInBox;

  return clamper(boxDimensions, position);
}

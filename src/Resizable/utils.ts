import { mapObjIndexed } from "ramda";
import {
  getOrigin,
  IDimensions,
  IPoint,
  IPosition,
  mergeWithAdd,
} from "../utils";

interface IThumb {
  name: IThumKey;
  point: IPoint;
}

const enum ERectangleSides {
  top = "top",
  bottom = "bottom",
  left = "left",
  right = "right",
}

const enum ERectangleCorners {
  topLeft = "topLeft",
  topRight = "topRight",
  bottomRight = "bottomRight",
  bottomLeft = "bottomLeft",
}

export type IThumKey = ERectangleCorners;

export function getThumbs(elementPosition: IPosition): IThumb[] {
  const { width: w, height: h } = elementPosition;

  return [
    { name: ERectangleCorners.topLeft, point: { left: 0, top: 0 } },
    { name: ERectangleCorners.topRight, point: { left: w, top: 0 } },
    { name: ERectangleCorners.bottomRight, point: { left: w, top: h } },
    { name: ERectangleCorners.bottomLeft, point: { left: 0, top: h } },
  ];
}

export function updatePosition(
  { name, point }: IThumb,
  prevPosition: IPosition
): IPosition {
  const origin = getOrigin(prevPosition);

  const absolutePoint = mergeWithAdd(point, origin);
  const { left: px, top: py } = absolutePoint;

  const updatedPart = mergeCornerSides(name, {
    left: { left: px },
    right: { right: px },
    top: { top: py },
    bottom: { bottom: py },
  });

  return fromRectanglePosition({
    ...toRectanglePosition(prevPosition),
    ...updatedPart,
  });
}

export interface IDimensionsConstraints {
  min: IDimensions;
  max: IDimensions;
}

interface IRectanglePosition extends Record<ERectangleSides, number> {}

function mergeCornerSides<T extends Object, U extends Object>(
  name: ERectangleCorners,
  { top, bottom, right, left }: { top: T; bottom: T; right: U; left: U }
) {
  switch (name) {
    case ERectangleCorners.topLeft:
      return { ...top, ...left };
    case ERectangleCorners.topRight:
      return { ...top, ...right };
    case ERectangleCorners.bottomRight:
      return { ...bottom, ...right };
    case ERectangleCorners.bottomLeft:
      return { ...bottom, ...left };
  }
}

// function thumbFreedomLineSegment(name: IThumKey) {}

export function cornerConstraints(
  cornerName: ERectangleCorners,
  resizableDimensions: IDimensions,
  { min, max }: IDimensionsConstraints
) {
  const { width, height } = resizableDimensions;

  const { width: minWidth, height: minHeight } = min;
  const { width: maxWidth, height: maxHeight } = max;

  return mergeCornerSides(cornerName, {
    left: { left: width - maxWidth, right: width - minWidth },
    right: { left: minWidth, right: maxWidth },
    top: { top: height - maxHeight, bottom: height - minHeight },
    bottom: { top: minHeight, bottom: maxHeight },
  });
}

function fromRectanglePosition({
  left,
  right,
  top,
  bottom,
}: IRectanglePosition): IPosition {
  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };
}

function toRectanglePosition({
  left,
  top,
  width,
  height,
}: IPosition): IRectanglePosition {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
  };
}

export function resizableStyle(position: IPosition) {
  return {
    position: "absolute",
    ...mapObjIndexed((a) => `${a}px`, position),
  } as const;
}

import { draggableStyle } from "../Draggable/utils";
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
    { name: ERectangleCorners.topLeft, point: { x: 0, y: 0 } },
    { name: ERectangleCorners.topRight, point: { x: w, y: 0 } },
    { name: ERectangleCorners.bottomRight, point: { x: w, y: h } },
    { name: ERectangleCorners.bottomLeft, point: { x: 0, y: h } },
  ];
}

export function updatePosition(
  { name, point }: IThumb,
  prevPosition: IPosition
): IPosition {
  const origin = getOrigin(prevPosition);

  const absolutePoint = mergeWithAdd(point, origin);
  const { x: px, y: py } = absolutePoint;

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

export function cornerConstraints(
  cornerName: ERectangleCorners,
  resizableDimensions: IDimensions,
  { min, max }: IDimensionsConstraints
): IRectanglePosition {
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

export function pointProjection(a: IPoint, b: IPoint, c: IPoint): IPoint {
  const ac = toRadiusVector(a, c);
  const ab = toRadiusVector(a, b);

  const t = dot(ac, ab) / dot(ab, ab);

  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}

function toRadiusVector(a: IPoint, b: IPoint): IPoint {
  return { x: b.x - a.x, y: b.y - a.y };
}

function dot(a: IPoint, b: IPoint): number {
  return a.x * b.x + a.y * b.y;
}

function fromRectanglePosition({
  left,
  right,
  top,
  bottom,
}: IRectanglePosition): IPosition {
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function toRectanglePosition({
  x,
  y,
  width,
  height,
}: IPosition): IRectanglePosition {
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
  };
}

export function resizableStyle(position: IPosition) {
  return {
    ...draggableStyle(position),
    width: position.width,
    height: position.height,
  } as const;
}

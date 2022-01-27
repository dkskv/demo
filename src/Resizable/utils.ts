import { clamp } from "ramda";
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

interface IRectangleSides extends Record<ERectangleSides, number> {}

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

function cornerConstraints(
  cornerName: ERectangleCorners,
  resizableDimensions: IDimensions,
  { min, max }: IDimensionsConstraints
): IRectangleSides {
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

function pointProjection([a, b]: ILineSegment, c: IPoint): IPoint {
  const ac = toRadiusVector(a, c);
  const ab = toRadiusVector(a, b);

  // Коэффициент между [расстоянием от А до точки проекции] и [длиной вектора AB]
  const t = dot(ac, ab) / dot(ab, ab);

  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}

function toRadiusVector(a: IPoint, b: IPoint): IPoint {
  return { x: b.x - a.x, y: b.y - a.y };
}

function dot(a: IPoint, b: IPoint): number {
  return a.x * b.x + a.y * b.y;
}

const clampPointWithLine = pointProjection;

export function clampCornerThumb(
  resizableDimensions: IDimensions,
  dimensionsConstraints: IDimensionsConstraints,
  isRateably: boolean,
  { name, point }: IThumb
): IPoint {
  const constraints = cornerConstraints(
    name,
    resizableDimensions,
    dimensionsConstraints
  );

  const clampedPoint = clampPointWithRectangle(constraints, point);

  if (isRateably) {
    const diagonal = getCornerDiagonal(name, resizableDimensions);

    return clampPointWithLine(diagonal, clampedPoint);
  } else {
    return clampedPoint;
  }
}

function clampPointWithRectangle(
  constraints: IRectangleSides,
  { x, y }: IPoint
): IPoint {
  const { left, right, top, bottom } = constraints;

  return { x: clamp(left, right, x), y: clamp(top, bottom, y) };
}


type ILineSegment = [IPoint, IPoint];

function getCornerDiagonal(
  cornerName: ERectangleCorners,
  rectangleDimensions: IDimensions
): ILineSegment {
  const { height, width } = rectangleDimensions;

  switch (cornerName) {
    case ERectangleCorners.topLeft:
    case ERectangleCorners.bottomRight:
      return [
        { x: 0, y: 0 },
        { x: width, y: height },
      ];
    case ERectangleCorners.topRight:
    case ERectangleCorners.bottomLeft:
      return [
        { x: 0, y: height },
        { x: width, y: 0 },
      ];
  }
}

function fromRectanglePosition({
  left,
  right,
  top,
  bottom,
}: IRectangleSides): IPosition {
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
}: IPosition): IRectangleSides {
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

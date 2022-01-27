import { clamp } from "ramda";
import { draggableStyle } from "../Draggable/utils";
import {
  getOrigin,
  IDimensions,
  IPoint,
  IPosition,
  mergeWithAdd,
} from "../utils";

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

type ILineSegment = [IPoint, IPoint];

interface IRectangleSides extends Record<ERectangleSides, number> {}

export type IThumKey = ERectangleCorners;
export interface IDimensionsConstraints {
  min: IDimensions;
  max: IDimensions;
}

export const defaultDimensionsConstraints = {
  min: { width: 0, height: 0 },
  max: { width: Infinity, height: Infinity },
};

export abstract class CornerThumb {
  public abstract getInitialPoint(dimensions: IDimensions): IPoint;

  private getConstraints(
    resizableDimensions: IDimensions,
    { min, max }: IDimensionsConstraints
  ): IRectangleSides {
    const { width, height } = resizableDimensions;

    const { width: minWidth, height: minHeight } = min;
    const { width: maxWidth, height: maxHeight } = max;

    // Думаю создать функцию...
    return this.mergeSides({
      left: { left: width - maxWidth, right: width - minWidth },
      right: { left: minWidth, right: maxWidth },
      top: { top: height - maxHeight, bottom: height - minHeight },
      bottom: { top: minHeight, bottom: maxHeight },
    });
  }

  protected abstract mergeSides<T extends Object, U extends Object>({
    top,
    bottom,
    right,
    left,
  }: {
    top: T;
    bottom: T;
    right: U;
    left: U;
  }): T & U;

  protected abstract getCrossingDiagonal(
    rectangleDimensions: IDimensions
  ): ILineSegment;

  public clamp(
    currentDimensions: IDimensions,
    dimensionsConstraints: IDimensionsConstraints,
    isRateably: boolean,
    point: IPoint
  ): IPoint {
    const constraints = this.getConstraints(
      currentDimensions,
      dimensionsConstraints
    );

    const clampedPoint = clampPointWithRectangle(constraints, point);

    if (isRateably) {
      const diagonal = this.getCrossingDiagonal(currentDimensions);

      return clampPointWithLine(diagonal, clampedPoint);
    } else {
      return clampedPoint;
    }
  }

  public updateRectanglePosition(
    point: IPoint,
    prevPosition: IPosition
  ): IPosition {
    const origin = getOrigin(prevPosition);

    const absolutePoint = mergeWithAdd(point, origin);
    const { x: px, y: py } = absolutePoint;

    const updatedPart = this.mergeSides({
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
}

class LeftTopThumb extends CornerThumb {
  public getInitialPoint() {
    return { x: 0, y: 0 };
  }

  protected getCrossingDiagonal(dimensions: IDimensions) {
    return rectangleDiagonals(dimensions).descent;
  }

  protected mergeSides<T extends Object, U extends Object>({
    top,
    left,
  }: {
    top: T;
    left: U;
  }) {
    return { ...left, ...top };
  }
}

class RightTopThumb extends CornerThumb {
  public getInitialPoint({ width }: IDimensions) {
    return { x: width, y: 0 };
  }

  protected getCrossingDiagonal(dimensions: IDimensions) {
    return rectangleDiagonals(dimensions).ascent;
  }

  protected mergeSides<T extends Object, U extends Object>({
    top,
    right,
  }: {
    top: T;
    right: U;
  }) {
    return { ...right, ...top };
  }
}

class RightBottomThumb extends CornerThumb {
  public getInitialPoint({ width, height }: IDimensions) {
    return { x: width, y: height };
  }

  protected getCrossingDiagonal(dimensions: IDimensions) {
    return rectangleDiagonals(dimensions).descent;
  }

  protected mergeSides<T extends Object, U extends Object>({
    bottom,
    right,
  }: {
    bottom: T;
    right: U;
  }) {
    return { ...right, ...bottom };
  }
}

class LeftBottomThumb extends CornerThumb {
  public getInitialPoint({ height }: IDimensions) {
    return { x: 0, y: height };
  }

  protected getCrossingDiagonal(dimensions: IDimensions) {
    return rectangleDiagonals(dimensions).ascent;
  }

  protected mergeSides<T extends Object, U extends Object>({
    bottom,
    left,
  }: {
    bottom: T;
    left: U;
  }) {
    return { ...left, ...bottom };
  }
}

function rectangleDiagonals({ width, height }: IDimensions) {
  return {
    ascent: [
      { x: 0, y: height },
      { x: width, y: 0 },
    ] as ILineSegment,
    descent: [
      { x: 0, y: 0 },
      { x: width, y: height },
    ] as ILineSegment,
  };
}

function toRadiusVector(a: IPoint, b: IPoint): IPoint {
  return { x: b.x - a.x, y: b.y - a.y };
}

function dot(a: IPoint, b: IPoint): number {
  return a.x * b.x + a.y * b.y;
}

function pointProjection([a, b]: ILineSegment, c: IPoint): IPoint {
  const ac = toRadiusVector(a, c);
  const ab = toRadiusVector(a, b);

  // Коэффициент между [расстоянием от А до точки проекции] и [длиной вектора AB]
  const t = dot(ac, ab) / dot(ab, ab);

  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}

const clampPointWithLine = pointProjection;

function clampPointWithRectangle(
  constraints: IRectangleSides,
  { x, y }: IPoint
): IPoint {
  const { left, right, top, bottom } = constraints;

  return { x: clamp(left, right, x), y: clamp(top, bottom, y) };
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

export function getThumbs(): CornerThumb[] {
  return [
    new LeftTopThumb(),
    new RightTopThumb(),
    new RightBottomThumb(),
    new LeftBottomThumb(),
  ];
}

export function resizableStyle(position: IPosition) {
  return {
    ...draggableStyle(position),
    width: position.width,
    height: position.height,
  } as const;
}

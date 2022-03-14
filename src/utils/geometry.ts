import { mapObjIndexed } from "ramda";

export const enum EBoxSide {
  top = "top",
  bottom = "bottom",
  left = "left",
  right = "right",
}

export const enum EPointCoordinate {
  x = "x",
  y = "y"
}

export const enum EDimension {
  width = "width",
  height = "height"
}

export interface IBoxBounds extends Record<EBoxSide, number> {}

export interface IPoint extends Record<EPointCoordinate, number> {}

export interface IDimensions extends Record<EDimension, number> {}

export type ILineSegment = [IPoint, IPoint];

export interface IPosition extends IPoint, IDimensions {}

export function getDimensions({ width, height }: IPosition): IDimensions {
  return { width, height };
}

export function getOrigin({ x, y }: IPosition): IPoint {
  return { x, y };
}

function toRadiusVector(a: IPoint, b: IPoint): IPoint {
  return { x: b.x - a.x, y: b.y - a.y };
}

function dot(a: IPoint, b: IPoint): number {
  return a.x * b.x + a.y * b.y;
}

export function pointProjection([a, b]: ILineSegment, c: IPoint): IPoint {
  const ac = toRadiusVector(a, c);
  const ab = toRadiusVector(a, b);

  // Коэффициент между [расстоянием от А до точки проекции] и [длиной вектора AB]
  // А где рисунок к комментарию?))
  const t = dot(ac, ab) / dot(ab, ab);

  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}

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

export function normalize<T extends Record<string, number>>(obj: T, length: number) {
  return mapObjIndexed((a) => a / length, obj) as T;
}

export function denormalize<T extends Record<string, number>>(obj: T, length: number) {
  return mapObjIndexed((a) => a * length, obj) as T;
}
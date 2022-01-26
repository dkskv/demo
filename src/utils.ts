import { is, mergeWith } from "ramda";

export interface IPoint {
  left: number;
  top: number;
}

export interface IDimensions {
  width: number;
  height: number;
}

export interface IPosition extends IPoint, IDimensions {}

export interface IPositionChangeCallback {
  (a: IPosition): void;
}

export function mergeWithAdd<A, B>(a: A, b: B) {
  return mergeWith((x, y) => x + y, a, b) as A & B;
}

function joinClassNames(names: string[]) {
  const validNames = names.filter(is(String));

  return validNames.join(" ");
}

export function getDimensions({ width, height }: IPosition): IDimensions {
  return { width, height };
}

export function getOrigin({ left, top }: IPosition): IPoint {
  return { left, top };
}

export function elementPosition(element: HTMLElement): IPosition {
  const rect = element.getBoundingClientRect();

  return { ...getOrigin(rect), ...getDimensions(rect) };
}

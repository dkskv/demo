import { is, xprod } from "ramda";
import { draggableStyle } from "../../Draggable/utils";
import { EBoxSide, type IPosition } from "../../utils/geometry";
import { CornerThumb, ICornerSides } from "./CornerThumb";
import { IDimensionsBounds } from "./geometry";
import { SideThumb } from "./SideThumb";
import { type Thumb } from "./Thumb";

export type IThumbKey = EBoxSide | ICornerSides;

const l = EBoxSide.left;
const r = EBoxSide.right;
const t = EBoxSide.top;
const b = EBoxSide.bottom;

export const cornerThumbKeys = xprod([l, r] as const, [t, b] as const);
export const sideThumbKeys = [l, t, r, b];
export const allThumbKeys = [...cornerThumbKeys, ...sideThumbKeys];

export function getThumbs(includedKeys: IThumbKey[] = []): Thumb[] {
  return includedKeys.map((key) =>
    is(String, key) ? new SideThumb(key) : new CornerThumb(key)
  );
}

export function withDefaultDimensionsBounds(
  dimensionsBounds: Partial<IDimensionsBounds> = {}
) {
  return {
    min: { width: 0, height: 0 },
    max: { width: Infinity, height: Infinity },
    ...dimensionsBounds,
  };
}

export function resizableStyle(position: IPosition) {
  return {
    ...draggableStyle(position),
    width: position.width,
    height: position.height,
  } as const;
}

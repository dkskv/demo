import { draggableStyle } from "../../Draggable/utils";
import { EBoxSides, type IPosition } from "../../utils/geometry";
import { CornerThumb } from "./CornerThumb";
import { SideThumb } from "./SideThumb";
import { type Thumb } from "./Thumb";

export function getThumbs(): Thumb[] {
    const l = EBoxSides.left;
    const r = EBoxSides.right;
    const t = EBoxSides.top;
    const b = EBoxSides.bottom;
  
    return [
      new CornerThumb([l, t]),
      new CornerThumb([r, t]),
      new CornerThumb([r, b]),
      new CornerThumb([l, b]),
      new SideThumb(l),
      new SideThumb(t),
      new SideThumb(r),
      new SideThumb(b),
    ];
  }

  export const defaultDimensionsBounds = {
    min: { width: 0, height: 0 },
    max: { width: Infinity, height: Infinity },
  };
  
  export function resizableStyle(position: IPosition) {
    return {
      ...draggableStyle(position),
      width: position.width,
      height: position.height,
    } as const;
  }
  
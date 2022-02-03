import { clampDragInBox } from "../Draggable/utils/geometry";
import { clampResizeInBox } from "../Resizable/utils/geometry";
import { type IDimensions, type IPosition } from "../utils/geometry";

export const enum EOrientation {
  vertical,
  horizontal,
}

export interface IRange {
  begin: number;
  end: number;
}

export function updatePosition(
  containerDimensions: IDimensions,
  isDrag: boolean,
  position: IPosition
): IPosition {
  const clamper = isDrag ? clampDragInBox : clampResizeInBox;
  
  return clamper(containerDimensions, position);
}

export const TrackRangeConverter = {
  to(position: IPosition, orientation: EOrientation) {
    const { x, width, y, height } = position;

    switch (orientation) {
      case EOrientation.horizontal:
        return { begin: x, end: x + width };
      case EOrientation.vertical:
        return { begin: y, end: y + height };
    }
  },
  from(range: IRange, orientation: EOrientation, trackThickness: number) {
    const { begin, end } = range;

    switch (orientation) {
      case EOrientation.horizontal:
        return {
          x: begin,
          width: end - begin,
          y: 0,
          height: trackThickness,
        };
      case EOrientation.vertical:
        return {
          x: 0,
          width: trackThickness,
          y: begin,
          height: end - begin,
        };
    }
  },
};

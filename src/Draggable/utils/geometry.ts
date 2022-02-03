import { clamp } from "ramda";
import { IDimensions, IPosition } from "../../utils/geometry";

export function clampDragInBox(
  boxDimensions: IDimensions,
  position: IPosition
) {
  const { width, height } = boxDimensions;

  return {
    ...position,
    ...{
      x: clamp(0, width - position.width, position.x),
      y: clamp(0, height - position.height, position.y),
    },
  };
}

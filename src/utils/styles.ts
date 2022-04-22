import { BoundingBox } from "./boundingBox";
import { Point } from "./point";

export function getPointStyle({ x, y }: Point) {
  return {
    left: `${x}px`,
    top: `${y}px`,
  } as const;
}

export function getBoxStyle(box: BoundingBox) {
  return {
    ...getPointStyle(box.origin),
    width: `${box.dx}px`,
    height: `${box.dy}px`,
  } as const;
}

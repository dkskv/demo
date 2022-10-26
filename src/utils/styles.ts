import { splitEvery, tail } from "ramda";
import { BoundingBox } from "../entities/boundingBox";
import { Point } from "../entities/point";

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

export const stretchStyle = {
  width: "100%",
  height: "100%",
} as const;

export const centererStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
} as const;

export const ellipsisStyle = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
} as const;

export function getRgbaColor(hexColor: `#${string}`, opacity: number): string {
  const hexParts = splitEvery(2, tail(hexColor));
  const [r, g, b] = hexParts.map((n) => parseInt(n, 16));

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

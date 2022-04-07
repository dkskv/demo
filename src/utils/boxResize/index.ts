import { is, xprod } from "ramda";
import { EBoxSide, horizontalSides, verticalSides } from "../sides";
import { MovableEdge, MovableCorner, type MovableElement } from "./movableElement";

type ICornerSidesKey = [EBoxSide.left | EBoxSide.right, EBoxSide.top | EBoxSide.bottom];
type EdgeSideKey = EBoxSide;
export type IMovableElementKey = EdgeSideKey | ICornerSidesKey;

export const cornerThumbKeys: readonly ICornerSidesKey[] = xprod(horizontalSides, verticalSides);
export const edgeThumbKeys: readonly EBoxSide[] = [...horizontalSides, ...verticalSides];
export const allThumbKeys: readonly IMovableElementKey[] = [...cornerThumbKeys, ...edgeThumbKeys];

export function getMovableElements(includedKeys: readonly IMovableElementKey[] = []): MovableElement[] {
  return includedKeys.map((key) =>
    is(String, key) ? new MovableEdge(key) : new MovableCorner(key)
  );
}

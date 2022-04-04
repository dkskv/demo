import { is, xprod } from "ramda";
import { draggableStyle } from "../../Draggable/utils";
import { BoundingBox } from "../../utils/boundingBox";
import { EBoxSide, horizontalSides, verticalSides } from "../../utils/sides";
import { MovableEdge, MovableCorner, type MovableGroup } from "./movableGroup";

export type ICornerSidesKey = [EBoxSide.left | EBoxSide.right, EBoxSide.top | EBoxSide.bottom];
export type IThumbKey = EBoxSide | ICornerSidesKey;

export const cornerThumbKeys: readonly ICornerSidesKey[] = xprod(horizontalSides, verticalSides);
export const edgeThumbKeys: readonly EBoxSide[] = [...horizontalSides, ...verticalSides];
export const allThumbKeys: readonly IThumbKey[] = [...cornerThumbKeys, ...edgeThumbKeys];

export function getThumbs(includedKeys: readonly IThumbKey[] = []): MovableGroup[] {
  return includedKeys.map((key) =>
    is(String, key) ? new MovableEdge(key) : new MovableCorner(key)
  );
}

export function resizableStyle(box: BoundingBox) {
  return {
    ...draggableStyle(box.origin),
    width: `${box.dx}px`,
    height: `${box.dy}px`,
  } as const;
}

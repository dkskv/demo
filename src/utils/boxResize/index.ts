import { is, xprod } from "ramda";
import { EBoxSide, horizontalSides, verticalSides } from "../sides";
import { ResizingPoint } from "./resizingPoint";

type ICornerSidesKey = [EBoxSide.left | EBoxSide.right, EBoxSide.top | EBoxSide.bottom];
type EdgeSideKey = EBoxSide;
export type IMovableElementKey = EdgeSideKey | ICornerSidesKey;

export const cornerThumbKeys: readonly ICornerSidesKey[] = xprod(horizontalSides, verticalSides);
export const edgeThumbKeys: readonly EBoxSide[] = [...horizontalSides, ...verticalSides];
export const allThumbKeys: readonly IMovableElementKey[] = [...cornerThumbKeys, ...edgeThumbKeys];

export function getResizingPoints(includedKeys: readonly IMovableElementKey[] = []): ResizingPoint[] {
  return includedKeys.map((key) => {
    let x = 0;
    let y = 0;

    if (is(String, key)) {
      y += 0.5;
      x += 0.5;

      switch(key) {
        case EBoxSide.left:
          x -= 0.5;
          break;
        case EBoxSide.right:
          x += 0.5;
          break;
        case EBoxSide.top:
          y -= 0.5;
          break; 
        case EBoxSide.bottom:
          y += 0.5;
          break;   
      }
    } else {
      if (key.includes(EBoxSide.right)) {
        x += 1;
      }
      if (key.includes(EBoxSide.bottom)) {
        y += 1;
      }
    }

    return new ResizingPoint(x, y);
  });
}
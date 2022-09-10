import { BoundingBox } from "../boundingBox";
import { compareWithPrecision } from "../common";
import { Point } from "../point";
import { SizeBounds } from "../sizeBounds";

interface IBoxConstraints {
  aspectRatio: number | null;
  sizeBounds: SizeBounds;
  outerBox: BoundingBox;
}

interface IInitialConditions {
  sourceBox: BoundingBox;
  transformOrigin: Point;
}

export function constrainResizedBox(
  resizedBox: BoundingBox,
  { sourceBox, transformOrigin }: IInitialConditions,
  { aspectRatio, sizeBounds, outerBox }: IBoxConstraints
) {
  const keepAspectRatio = aspectRatio !== null;

  if (keepAspectRatio) {
    resizedBox = resizedBox.setAspectRatio(aspectRatio);
  }

  resizedBox = resizedBox
    .constrainSize(sizeBounds.dxBounds, sizeBounds.dyBounds)
    .placeInSameOrigin(sourceBox, transformOrigin)
    .clipByOuter(outerBox);

  if (!keepAspectRatio) {
    return resizedBox;
  }

  const isAspectRatioBroken =
    compareWithPrecision(aspectRatio, resizedBox.aspectRatio, 5) !== 0;

  if (!isAspectRatioBroken) {
    return resizedBox;
  }

  const scalingSign = Math.sign(resizedBox.area - sourceBox.area);
  const f = scalingSign > 0 ? Math.min : Math.max;

  return sourceBox
    .scale(f(resizedBox.dx / sourceBox.dx, resizedBox.dy / sourceBox.dy))
    .placeInSameOrigin(sourceBox, transformOrigin)
    .clampByOuter(outerBox);
}

import { BoundingBox } from "../../../utils/boundingBox";
import { compareWithPrecision } from "../../../utils/common";
import { Point } from "../../../utils/point";
import { SizeLimits } from "../../../utils/sizeLimits";

interface IBoxConstraints {
  aspectRatio: number | null;
  sizeLimits: SizeLimits;
  outerBox: BoundingBox;
}

interface IInitialConditions {
  sourceBox: BoundingBox;
  transformOrigin: Point;
}

export function constrainResizedBox(
  resizedBox: BoundingBox,
  { sourceBox, transformOrigin }: IInitialConditions,
  { aspectRatio, sizeLimits, outerBox }: IBoxConstraints
) {
  const keepAspectRatio = aspectRatio !== null;

  if (keepAspectRatio) {
    resizedBox = resizedBox.setAspectRatio(aspectRatio);
  }

  resizedBox = resizedBox
    .constrainSize(sizeLimits.dxLimits, sizeLimits.dyLimits)
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

export function wasConstrainedBySizeLimits(
  sourceBox: BoundingBox,
  constrainedBox: BoundingBox,
  sizeLimits: SizeLimits
) {
  let { dxLimits, dyLimits } = sizeLimits;
  dxLimits = dxLimits.map(Math.round);
  dyLimits = dyLimits.map(Math.round);

  const sourceDx = Math.round(sourceBox.dx);
  const sourceDy = Math.round(sourceBox.dy);
  const constrainedDx = Math.round(constrainedBox.dx);
  const constrainedDy = Math.round(constrainedBox.dy);

  return (
    (!dxLimits.isEdge(sourceDx) && dxLimits.isEdge(constrainedDx)) ||
    (!dyLimits.isEdge(sourceDy) && dyLimits.isEdge(constrainedDy))
  );
}

import { BoundingBox } from "../../utils/boundingBox";
import { ISizeBounds } from "../../utils/boxResize/constraints";
import { denormalize } from "../../utils/normalization";

export function denormalizeSizeBounds(
  sizeBounds: ISizeBounds,
  outerBox: BoundingBox
) {
  const denormalizedSizeBounds: ISizeBounds = {};

  if (sizeBounds.width) {
    denormalizedSizeBounds.width = denormalize(sizeBounds.width, outerBox.dx);
  }

  if (sizeBounds.height) {
    denormalizedSizeBounds.height = denormalize(sizeBounds.height, outerBox.dy);
  }

  return denormalizedSizeBounds;
}

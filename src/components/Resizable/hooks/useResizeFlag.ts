import { usePrevious } from "../../../decorators/usePrevious";
import { BoundingBox } from "../../../entities/boundingBox";

export function useResizeFlag(box: BoundingBox) {
  const previousBox = usePrevious(box);
  return previousBox && !box.isEqual(previousBox);
}

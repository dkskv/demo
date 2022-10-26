import { useEffect } from "react";
import { useAnimationStage } from "../../../decorators/useAnimationStage";
import { usePrevious } from "../../../decorators/usePrevious";
import { BoundingBox } from "../../../entities/boundingBox";
import { SizeLimits } from "../../../entities/sizeLimits";
import { wasConstrainedBySizeLimits } from "../utils/constraints";

export function useHighlightingOnSizeLimit(
  value: BoundingBox | null,
  sizeLimits: SizeLimits
) {
  const [highlightingStage, highlight] = useAnimationStage({
    duration: 300,
    shouldResetOnEnd: true,
  });

  const prevValue = usePrevious(value);

  useEffect(() => {
    if (
      prevValue &&
      value &&
      wasConstrainedBySizeLimits(prevValue, value, sizeLimits)
    ) {
      highlight();
    }
  }, [value, prevValue, highlight, sizeLimits]);

  return highlightingStage;
}

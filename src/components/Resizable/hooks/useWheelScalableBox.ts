import { useCallback } from "react";
import { BoundingBox } from "../../../entities/boundingBox";
import { useActualRef } from "../../../decorators/useActualRef";
import {
  IScaleEvent,
  useWheelScaling,
} from "../../../decorators/useWheelScaling";
import { noop } from "../../../utils/common";
import { IResizeCallbacks, IResizeConstraints } from "../index.types";
import { constrainResizedBox } from "../utils/constraints";

interface IParams extends IResizeCallbacks, IResizeConstraints {
  box: BoundingBox;
  element: Element | null;
}

export function useWheelScalableBox({
  element,
  box,
  onChange,
  onStart = noop,
  onEnd = noop,
  outerBox,
  sizeLimits,
  keepAspectRatio,
}: IParams) {
  const actualBox = useActualRef(box);

  const handleScaleStart = useCallback(
    ({ pressedKeys }: IScaleEvent) => {
      onStart({ box: actualBox.current, pressedKeys });
    },
    [actualBox, onStart]
  );

  const handleScaleEnd = useCallback(
    ({ pressedKeys }: IScaleEvent) => {
      onEnd({ box: actualBox.current, pressedKeys });
    },
    [actualBox, onEnd]
  );

  const handleScale = useCallback(
    ({ pressedKeys, scalingK, origin }: IScaleEvent) => {
      const value = actualBox.current;
      const scaledBox = value.scale(scalingK);
      const constraints = {
        aspectRatio: keepAspectRatio ? scaledBox.aspectRatio : null,
        outerBox,
        sizeLimits,
      };

      const nextBox = constrainResizedBox(
        scaledBox,
        { sourceBox: value, transformOrigin: origin },
        constraints
      );

      onChange({ box: nextBox, pressedKeys });
    },
    [actualBox, onChange, outerBox, sizeLimits, keepAspectRatio]
  );

  useWheelScaling(element, {
    onChange: handleScale,
    onStart: handleScaleStart,
    onEnd: handleScaleEnd,
  });
}

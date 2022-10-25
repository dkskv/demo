import { useCallback } from "react";
import { BoundingBox } from "../../../utils/boundingBox";
import { useActualRef } from "./../../../decorators/useActualRef";
import { IScaleEvent, useScale } from "./../../../decorators/useScale";
import { defineWheelScalingK, noop } from "./../../../utils/common";
import { IResizeCallbacks, IResizeConstrains } from "./../index.types";
import { constrainResizedBox } from "./../utils/constraints";

interface IParams extends IResizeCallbacks, IResizeConstrains {
  box: BoundingBox;
  element: Element | null;
}

export function useScalableBox({
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
    ({ pressedKeys, delta, origin }: IScaleEvent) => {
      const value = actualBox.current;
      const scaledBox = value.scale(defineWheelScalingK(delta));
      const constrains = {
        aspectRatio: keepAspectRatio ? scaledBox.aspectRatio : null,
        outerBox,
        sizeLimits,
      };

      const nextBox = constrainResizedBox(
        scaledBox,
        { sourceBox: value, transformOrigin: origin },
        constrains
      );

      onChange({ box: nextBox, pressedKeys });
    },
    [actualBox, onChange, outerBox, sizeLimits, keepAspectRatio]
  );

  useScale(element, {
    onChange: handleScale,
    onStart: handleScaleStart,
    onEnd: handleScaleEnd,
  });
}

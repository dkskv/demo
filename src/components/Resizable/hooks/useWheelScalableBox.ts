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

interface IParams extends IResizeCallbacks {
  box: BoundingBox;
  element: Element | null;
  constraints: IResizeConstraints;
}

export function useWheelScalableBox({
  element,
  box,
  onChange,
  onStart = noop,
  onEnd = noop,
  constraints,
}: IParams) {
  const actualBox = useActualRef(box);
  const actualConstraints = useActualRef(constraints);

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
      const box = actualBox.current;
      const scaledBox = box.scale(scalingK);

      const constraints = actualConstraints.current;
      const preparedConstraints = {
        ...constraints,
        aspectRatio: constraints.keepAspectRatio ? scaledBox.aspectRatio : null,
      };

      const nextBox = constrainResizedBox(
        scaledBox,
        { sourceBox: box, transformOrigin: origin },
        preparedConstraints
      );

      onChange({ box: nextBox, pressedKeys });
    },
    [actualBox, onChange, actualConstraints]
  );

  useWheelScaling(element, {
    onChange: handleScale,
    onStart: handleScaleStart,
    onEnd: handleScaleEnd,
  });
}

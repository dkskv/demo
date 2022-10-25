import { useCallback, useRef } from "react";
import { ResizingHandle } from "./../utils/resizingHandle";
import {
  IResizeHandleKey,
  resizingHandlesPreset,
} from "./../utils/resizingHandlesPreset";
import { constrainResizedBox } from "./../utils/constraints";
import { useActualRef } from "./../../../decorators/useActualRef";
import { IDragCallback, IDragEvent } from "./../../../utils/drag";
import { IResizeCallbacks, IResizeConstrains } from "./../index.types";
import { BoundingBox } from "../../../utils/boundingBox";

interface IParams extends IResizeCallbacks, IResizeConstrains {
  box: BoundingBox;
  handlesKeys: readonly IResizeHandleKey[];
}

export function useResize(params: IParams) {
  const { onChange, onStart, onEnd, handlesKeys } = params;
  const aspectRatioRef = useRef<number | null>(null);
  const paramsRef = useActualRef(params);

  const handleStart: IDragCallback = useCallback(
    ({ pressedKeys }) => {
      const { box } = paramsRef.current;
      aspectRatioRef.current = box.aspectRatio;
      onStart?.({ pressedKeys, box });
    },
    [paramsRef, onStart]
  );

  const handleEnd: IDragCallback = useCallback(
    ({ pressedKeys }) => {
      const { box } = paramsRef.current;
      onEnd?.({ pressedKeys, box });
    },
    [paramsRef, onEnd]
  );

  const handleHandleDrag = useCallback(
    (handle: ResizingHandle, event: IDragEvent) => {
      const { box, keepAspectRatio, sizeLimits, outerBox } = paramsRef.current;
      const { point, pressedKeys } = event;
      const resizedBox = handle.resizeBox(box, point);

      const constraints = {
        aspectRatio:
          keepAspectRatio || pressedKeys.shiftKey
            ? aspectRatioRef.current
            : null,
        sizeLimits,
        outerBox,
      } as const;

      const constrainedBox = constrainResizedBox(
        resizedBox,
        { sourceBox: box, transformOrigin: handle.mirroredPoint },
        constraints
      );

      onChange({ pressedKeys, box: constrainedBox });
    },
    [paramsRef, onChange]
  );

  // Кнопки нужно располагать в одной системе координат с resizable-элементом
  return handlesKeys.map((key) => {
    const resizingHandle = resizingHandlesPreset.get(key);

    return {
      key: String(key),
      value: params.box.denormalizePoint(resizingHandle),
      onChange(event: IDragEvent) {
        handleHandleDrag(resizingHandle, event);
      },
      onStart: handleStart,
      onEnd: handleEnd,
    } as const;
  });
}

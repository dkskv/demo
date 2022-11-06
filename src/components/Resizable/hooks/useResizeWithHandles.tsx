import { useCallback, useRef } from "react";
import { ResizingHandle } from "../utils/resizingHandle";
import { resizingHandlesPreset } from "../utils/resizingHandlesPreset";
import { constrainResizedBox } from "../utils/constraints";
import { useActualRef } from "../../../decorators/useActualRef";
import { IDragCallback, IDragEvent } from "../../../utils/drag";
import { IResizeCallbacks, IResizableSettings } from "../index.types";
import { BoundingBox } from "../../../entities/boundingBox";

interface IParams extends IResizeCallbacks, IResizableSettings {
  box: BoundingBox;
}

export function useResizeWithHandles(params: IParams) {
  const {
    onChange,
    onStart,
    onEnd,
    handlesKeys = resizingHandlesPreset.all,
  } = params;
  const aspectRatioRef = useRef<number | null>(null);
  const paramsRef = useActualRef(params);

  const handleItemStart: IDragCallback = useCallback(
    ({ pressedKeys }) => {
      const { box } = paramsRef.current;
      aspectRatioRef.current = box.aspectRatio;
      onStart?.({ pressedKeys, box });
    },
    [paramsRef, onStart]
  );

  const handleItemEnd: IDragCallback = useCallback(
    ({ pressedKeys }) => {
      const { box } = paramsRef.current;
      onEnd?.({ pressedKeys, box });
    },
    [paramsRef, onEnd]
  );

  const handleItemDrag = useCallback(
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
    const handle = resizingHandlesPreset.get(key);

    return {
      key: String(key),
      value: params.box.denormalizePoint(handle),
      origin: handle.mirroredPoint,
      onChange(event: IDragEvent) {
        handleItemDrag(handle, event);
      },
      onStart: handleItemStart,
      onEnd: handleItemEnd,
    } as const;
  });
}

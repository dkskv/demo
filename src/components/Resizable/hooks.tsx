import { useCallback, useEffect, useRef } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { defineWheelScalingK, noop, type IPressedKeys } from "../../utils/common";
import { ResizingHandle } from "./utils/resizingHandle";
import { IResizeHandleKey, resizingHandlesPreset } from "./utils/resizingHandlesPreset";
import { constrainResizedBox, wasConstrainedBySizeLimits } from "./utils/constraints";
import { useActualRef } from "../../decorators/useActualRef";
import { IDragCallback, IDragEvent } from "../../utils/drag";
import { IScaleEvent, useScale } from "../../decorators/useScale";
import { SizeLimits } from "../../utils/sizeLimits";
import { useAnimationStage } from "../../decorators/useAnimationStage";
import { usePrevious } from "../../decorators/usePrevious";

export function useHighlightingOnSizeLimit(value: BoundingBox | null, sizeLimits: SizeLimits) {
  const [highlightingStage, highlight] = useAnimationStage({
    duration: 300,
    shouldResetOnEnd: true,
  });

  const prevValue = usePrevious(value);

  useEffect(() => {
    if (prevValue && value && wasConstrainedBySizeLimits(prevValue, value, sizeLimits)) {
      highlight();
    }
  }, [value, prevValue, highlight, sizeLimits]);

  return highlightingStage;
}

export interface IResizeEvent {
  box: BoundingBox;
  pressedKeys: IPressedKeys;
}

export interface IResizeCallback {
  (e: IResizeEvent): void;
}

export interface IResizeParams {
  /** Текущее состояние бокса */
  box: BoundingBox;

  onStart?: IResizeCallback;
  onChange: IResizeCallback;
  onEnd?: IResizeCallback;

  /** Ограничения размера сторон */
  sizeLimits: SizeLimits;

  /** Сохранять соотношении сторон */
  keepAspectRatio: boolean;

  /** Внешний бокс, за пределы которого нельзя выходить */
  outerBox: BoundingBox;

  /** Ключи отображаемых кнопок, за которые производится resize  */
  handlesKeys: readonly IResizeHandleKey[];
}

export function useResize(params: IResizeParams) {
  const {
    onChange,
    onStart,
    onEnd,
    handlesKeys,
  } = params;
  const aspectRatioRef = useRef<number | null>(null);
  const paramsRef = useActualRef(params);

  const handleStart: IDragCallback = useCallback(({ pressedKeys }) => {
    const { box } = paramsRef.current;
    aspectRatioRef.current = box.aspectRatio;
    onStart?.({ pressedKeys, box });
  }, [paramsRef, onStart]);

  const handleEnd: IDragCallback = useCallback(({ pressedKeys }) => {
    const { box } = paramsRef.current;
    onEnd?.({ pressedKeys, box });
  }, [paramsRef, onEnd]);

  const handleHandleDrag = useCallback(
    (
      handle: ResizingHandle,
      event: IDragEvent
    ) => {
      const { box, keepAspectRatio, sizeLimits, outerBox } = paramsRef.current;
      const {point, pressedKeys} = event;
      const resizedBox = handle.resizeBox(box, point);

      const constraints = {
        aspectRatio: keepAspectRatio || pressedKeys.shiftKey ? aspectRatioRef.current : null,
        sizeLimits,
        outerBox
      } as const;

      const constrainedBox = constrainResizedBox(
        resizedBox,
        { sourceBox: box, transformOrigin: handle.mirroredPoint },
        constraints
      );

      onChange({pressedKeys, box: constrainedBox});
    },
    [paramsRef, onChange]
  )

  // Кнопки нужно располагать в одной системе координат с resizable-элементом
  return handlesKeys.map((key) => {
    const resizingHandle = resizingHandlesPreset.get(key);
    const { box } = paramsRef.current;

    return {
      key: String(key),
      value: box.denormalizePoint(resizingHandle),
      onChange(event: IDragEvent) {
        handleHandleDrag(resizingHandle, event)
      },
      onStart: handleStart,
      onEnd: handleEnd,
    } as const;
  })
}

interface IScalableBoxParams {
  box: BoundingBox;
  onStart?: IResizeCallback;
  onChange: IResizeCallback;
  onEnd?: IResizeCallback;
  element: Element | null;
  sizeLimits: SizeLimits;
  outerBox: BoundingBox;
  keepAspectRatio: boolean;
}

export function useScalableBox({
  element,
  box,
  onChange,
  onStart = noop,
  onEnd = noop,
  outerBox,
  sizeLimits,
  keepAspectRatio
}: IScalableBoxParams) {
  const actualBox = useActualRef(box);

  const handleScaleStart = useCallback(
    ({ pressedKeys }: IScaleEvent) => {
      onStart({box: actualBox.current, pressedKeys});
    },
    [actualBox, onStart]
  );

  const handleScaleEnd = useCallback(
    ({ pressedKeys }: IScaleEvent) => {
      onEnd({box: actualBox.current, pressedKeys});
    },
    [actualBox, onEnd]
  );

  const handleScale = useCallback(
    ({ pressedKeys, delta, origin }: IScaleEvent) => {
      const value = actualBox.current;
      const scaledBox = value.scale(defineWheelScalingK(delta));
      const constrains = { aspectRatio: keepAspectRatio ? scaledBox.aspectRatio : null, outerBox, sizeLimits };

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
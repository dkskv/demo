import { useCallback, useEffect, useRef } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { defineWheelScalingK, noop, type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { ResizingHandle } from "./utils/resizingHandle";
import { IResizeHandleKey, resizingHandlesPreset } from "./utils/resizingHandlesPreset";
import { constrainResizedBox, wasConstrainedBySizeLimits } from "./utils/constraints";
import { useActualRef } from "../../decorators/useActualRef";
import { IDragBoxCallback, IDragBoxCallbacks } from "../../decorators/dnd";
import { IDragCallback } from "../../utils/drag";
import { useScale } from "../../decorators/useScale";
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

export interface IResizeParams extends Partial<IDragBoxCallbacks> {
  /** Текущее состояние бокса */
  box: BoundingBox;

  onChange: IDragBoxCallback;

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

  const handleStart: IDragCallback = useCallback((_, pk) => {
    const { box } = paramsRef.current;
    aspectRatioRef.current = box.aspectRatio;
    onStart?.(box, pk);
  }, [paramsRef, onStart]);

  const handleEnd: IDragCallback = useCallback((_, pk) => {
    const { box } = paramsRef.current;
    onEnd?.(box, pk);
  }, [paramsRef, onEnd]);

  const handleChangeSize = useCallback(
    (
      handle: ResizingHandle,
      movedHandlePoint: Point,
      pressedKeys: IPressedKeys
    ) => {
      const { box, keepAspectRatio, sizeLimits, outerBox } = paramsRef.current;

      const resizedBox = handle.resizeBox(box, movedHandlePoint);

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

      onChange(constrainedBox, pressedKeys);
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
      onChange(point: Point, pressedKeys: IPressedKeys) {
        handleChangeSize(resizingHandle, point, pressedKeys)
      },
      onStart: handleStart,
      onEnd: handleEnd,
    } as const;
  })
}

interface IScalableBoxParams extends Partial<IDragBoxCallbacks> {
  box: BoundingBox;
  onChange: IDragBoxCallback;
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
    (_: Point, pressedKeys: IPressedKeys) => {
      onStart(actualBox.current, pressedKeys);
    },
    [actualBox, onStart]
  );

  const handleScaleEnd = useCallback(
    (_: Point, pressedKeys: IPressedKeys) => {
      onEnd(actualBox.current, pressedKeys);
    },
    [actualBox, onEnd]
  );

  const handleScale = useCallback(
    (delta: number, p: Point, pressedKeys: IPressedKeys) => {
      const value = actualBox.current;
      const scaledBox = value.scale(defineWheelScalingK(delta));

      const nextBox = constrainResizedBox(
        scaledBox,
        { sourceBox: value, transformOrigin: p },
        { aspectRatio: keepAspectRatio ? scaledBox.aspectRatio : null, outerBox, sizeLimits }
      );

      onChange(nextBox, pressedKeys);
    },
    [actualBox, onChange, outerBox, sizeLimits, keepAspectRatio]
  );

  useScale(element, {
    onChange: handleScale,
    onStart: handleScaleStart,
    onEnd: handleScaleEnd,
  });
}
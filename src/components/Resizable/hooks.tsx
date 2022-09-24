import { useCallback, useEffect, useRef } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { defineWheelScalingK, noop, type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { ResizingHandle } from "../../utils/boxResize/resizingHandle";
import { IResizeHandleKey, resizingHandlesPreset } from "../../utils/boxResize/resizingHandlesPreset";
import { constrainResizedBox, wasConstrainedBySizeBounds } from "../../utils/boxResize/constraints";
import { useActualRef } from "../../decorators/useActualRef";
import { IDragBoxCallback, IDragBoxCallbacks } from "../../decorators/dnd";
import { IDragCallback } from "../../utils/drag";
import { useScale } from "../../decorators/useScale";
import { SizeBounds } from "../../utils/sizeBounds";
import { useAnimationStage } from "../../decorators/useAnimationStage";
import { usePrevious } from "../../decorators/usePrevious";

export function useHighlightingOnSizeLimit(value: BoundingBox, sizeBounds: SizeBounds) {
  const prevValue = usePrevious(value);
  const [highlightingStage, highlight] = useAnimationStage({
    duration: 300,
    shouldResetOnEnd: true,
  });

  useEffect(() => {
    if (prevValue && wasConstrainedBySizeBounds(prevValue, value, sizeBounds)) {
      highlight();
    }
  }, [value, prevValue, highlight, sizeBounds]);

  return highlightingStage;
}

export interface IResizeParams extends Partial<IDragBoxCallbacks> {
  /** Текущее состояние бокса */
  box: BoundingBox;

  onChange: IDragBoxCallback;

  // Ограничения

  /** Ограничения размера сторон */
  sizeBounds: SizeBounds;

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
      const { box, keepAspectRatio, sizeBounds, outerBox } = paramsRef.current;

      const resizedBox = handle.resizeBox(box, movedHandlePoint);

      const constraints = {
        aspectRatio: keepAspectRatio || pressedKeys.shiftKey ? aspectRatioRef.current : null,
        sizeBounds,
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
  sizeBounds: SizeBounds;
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
  sizeBounds,
  keepAspectRatio
}: IScalableBoxParams) {
  const actualBox = useActualRef(box);

  const handleScaleStart = useCallback(
    (p: Point, pressedKeys: IPressedKeys) => {
      onStart(actualBox.current, pressedKeys);
    },
    [actualBox, onStart]
  );

  const handleScale = useCallback(
    (delta: number, p: Point, pressedKeys: IPressedKeys) => {
      const value = actualBox.current;
      const scaledBox = value.scale(defineWheelScalingK(delta));

      const nextBox = constrainResizedBox(
        scaledBox,
        { sourceBox: value, transformOrigin: p },
        { aspectRatio: keepAspectRatio ? scaledBox.aspectRatio : null, outerBox, sizeBounds }
      );

      onChange(nextBox, pressedKeys);
    },
    [actualBox, onChange, outerBox, sizeBounds, keepAspectRatio]
  );

  const handleScaleEnd = useCallback(
    (p: Point, pressedKeys: IPressedKeys) => {
      onEnd(actualBox.current, pressedKeys);
    },
    [actualBox, onEnd]
  );

  useScale(element, {
    onChange: handleScale,
    onStart: handleScaleStart,
    onEnd: handleScaleEnd,
  });
}
import { useCallback, useRef } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { defineWheelScalingK, noop, type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { ResizingPoint } from "../../utils/boxResize/resizingPoint";
import { IResizeThumbKey, resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { constrainResizedBox } from "../../utils/boxResize/constraints";
import { useActualRef } from "../../decorators/useActualRef";
import { IDragBoxCallback, IDragBoxCallbacks } from "../../decorators/dnd";
import { IDragCallback } from "../../utils/drag";
import { useScale } from "../../decorators/useScale";
import { SizeBounds } from "../../utils/sizeBounds";

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

  // Кнопки

  /** Ключи отображаемых кнопок, за которые производится resize  */
  thumbKeys: readonly IResizeThumbKey[];
}

export function useResize(params: IResizeParams) {
  const {
    onChange,
    onStart,
    onEnd,
    thumbKeys,
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
      resizingPoint: ResizingPoint,
      resizingPointTarget: Point,
      pressedKeys: IPressedKeys
    ) => {
      const { box, keepAspectRatio, sizeBounds, outerBox } = paramsRef.current;

      const resizedBox = resizingPoint.resizeBox(box, resizingPointTarget);

      const constraints = {
        aspectRatio: keepAspectRatio || pressedKeys.shiftKey ? aspectRatioRef.current : null,
        sizeBounds,
        outerBox
      } as const;

      const nextBox = constrainResizedBox(
        resizedBox,
        { sourceBox: box, transformOrigin: resizingPoint.mirroredPoint },
        constraints
      );

      onChange(nextBox, pressedKeys);
    },
    [paramsRef, onChange]
  )

  // Кнопки нужно располагать в одной системе координат с resizable-элементом
  return thumbKeys.map((key) => {
    const resizingPoint = resizingPointsPreset.get(key);
    const { box } = paramsRef.current;

    return {
      key: String(key),
      value: box.denormalizePoint(resizingPoint),
      onChange(point: Point, pressedKeys: IPressedKeys) {
        handleChangeSize(resizingPoint, point, pressedKeys)
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
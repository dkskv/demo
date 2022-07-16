import { useCallback, useRef } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { Draggable } from "../Draggable";
import { ResizingPoint } from "../../utils/boxResize/resizingPoint";
import { IResizeThumbKey, resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { ISizeBounds, updateBox } from "../../utils/boxResize";
import { useActualRef } from "../../decorators/useActualRef";
import { IDragBoxCallback, IDragBoxCallbacks } from "../../decorators/dnd";
import { IDragCallback } from "../../utils/drag";

export interface IResizeParams extends Partial<IDragBoxCallbacks> {
  /** Текущее состояние бокса */
  box: BoundingBox;

  onChange: IDragBoxCallback;

  // Ограничения

  /** Ограничения размера сторон */
  sizeBounds: ISizeBounds;

  /** Сохранять соотношении сторон */
  keepAspectRatio: boolean;

  /** Внешний бокс, за пределы которого нельзя выходить */
  outerBox: BoundingBox;

  // Кнопки

  /** Ключи отображаемых кнопок, за которые производится resize  */
  thumbKeys: readonly IResizeThumbKey[];

  /** React компонент кнопки, за которую производится resize */
  ThumbComponent: React.ComponentType<{}>;
}

export function useResize(params: IResizeParams): React.ReactNode {
  const {
    onChange,
    onStart,
    onEnd,
    thumbKeys,
    ThumbComponent,
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

      const updatedBox = updateBox({
        prevBox: box,
        resizingPoint,
        resizingPointTarget,
        aspectRatio: keepAspectRatio || pressedKeys.shiftKey ? aspectRatioRef.current : null,
        sizeBounds,
        outerBox
      });

      onChange(updatedBox, pressedKeys);
    }, 
    [paramsRef, onChange]
  )

  // Кнопки нужно располагать в одной системе координат с resizable-элементом
  return thumbKeys.map((key) => {
    const resizingPoint = resizingPointsPreset.get(key);
    const { box } = paramsRef.current;

    return (
      <Draggable
        key={String(key)}
        isCentered={true}
        value={box.denormalizePoint(resizingPoint)}
        onChange={(point, pressedKeys) =>
          handleChangeSize(resizingPoint, point, pressedKeys)
        }
        onStart={handleStart}
        onEnd={handleEnd}
      >
        <ThumbComponent />
      </Draggable>
    );
  })
}


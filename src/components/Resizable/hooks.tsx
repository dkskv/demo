import { useCallback, useRef } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { Draggable } from "../Draggable";
import { ResizingPoint } from "../../utils/boxResize/resizingPoint";
import { IResizeThumbKey, resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { ISizeBounds, updateBox } from "../../utils/boxResize";
import { useActualRef } from "../../decorators/useActualRef";
import { IDragCallbacks } from "../../utils/drag";
import { IDragParams, useDrag } from "../Draggable/hooks";
import { getBoxOnPage } from "../../utils/dom";

export interface IResizeParams extends Partial<
{ 
  onStart(pressedKeys: IPressedKeys): void;
  onEnd(pressedKeys: IPressedKeys): void;}
  > {
  /** Текущее состояние бокса */
  box: BoundingBox;

  onChange(box: BoundingBox, pressedKeys: IPressedKeys): void;

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

  const handleStart: typeof onStart = useCallback((pressedKeys) => {
    aspectRatioRef.current = paramsRef.current.box.aspectRatio;

    onStart?.(pressedKeys);
  }, [paramsRef, onStart]);

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
        onChange={(point, options) =>
          handleChangeSize(resizingPoint, point, options)
        }
        onStart={handleStart}
        onEnd={onEnd}
      >
        <ThumbComponent />
      </Draggable>
    );
  })
}

interface IDragBoxParams extends Omit<IDragParams, "onChange"> {
  onChange(box: BoundingBox, pressedKeys: IPressedKeys): void;
  outerBox?: BoundingBox;
}

/**
 * useDrag с измененным типом onChange: передает бокс вместо точки.
 * todo: вынести из Resizable.
 */
export function useDragBox(params: IDragBoxParams) {
  const { element, onChange } = params;
  const paramsRef = useActualRef(params);

  const handleChange: IDragCallbacks["onChange"] = useCallback((point, pressedKeys) => {
    const { outerBox } = paramsRef.current;
    const box = getBoxOnPage(element!).moveTo(point);

    onChange(outerBox ? outerBox.clampInner(box) : box, pressedKeys);
  }, [element, onChange, paramsRef]);

  return useDrag({...params, onChange: handleChange });
}
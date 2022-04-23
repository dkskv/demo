import { useCallback, useMemo } from "react";
import { useDrag } from "../Draggable/hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { BoxSizesBounds } from "../../utils/boxSizesBounds";
import {
  getResizingPoints,
  type IMovableElementKey,
} from "../../utils/boxResize";
import { Draggable } from "../Draggable";
import { ResizingPoint } from "../../utils/boxResize/resizingPoint";

export interface IResizeCallbackOptions {
  pressedKeys: IPressedKeys;
  isDrag: boolean;
}

export interface IResizeParams {
  /** Текущее состояние элемента */
  box: BoundingBox;

  /** Callback, срабатывающий при намерении изменить состояние элемента */
  onChange(box: BoundingBox, options: IResizeCallbackOptions): void;

  /** Если элемент передан, то его можно перемещать */
  draggableElement: HTMLElement | null;

  /** Ограничения размера сторон */
  sizesBounds: BoxSizesBounds;

  /** Сохранять соотношении сторон */
  keepAspectRatio: boolean;

  /** Ключи отображаемых кнопок, за которые производится resize  */
  thumbKeys: readonly IMovableElementKey[];

  /** React компонент кнопки, за которую производится resize */
  Thumb: React.ComponentType<{}>;
}

/** 
 * Возвращает кнопки, которые нужно расположить в одной системе координат 
 * с resizable-элементом
 */
export function useResize({
  box,
  draggableElement,
  onChange,
  sizesBounds,
  keepAspectRatio,
  thumbKeys,
  Thumb,
}: IResizeParams): React.ReactNode {
  const handleDrag = useCallback(
    (point: Point, pressedKeys: IPressedKeys) => {
      onChange(box.moveTo(point), { pressedKeys, isDrag: true });
    },
    [onChange, box]
  );

  useDrag({ element: draggableElement, onChange: handleDrag });

  const handleChangeThumb = useCallback(
    (
      resizingPoint: ResizingPoint,
      nextPoint: Point,
      pressedKeys: IPressedKeys
    ) => {
      // Изменение размера
      let updatedBox = resizingPoint.resizeBox(box, nextPoint);

      // Ограничение размера
      updatedBox = updatedBox.constrainDeltas(sizesBounds);

      // Сохранение соотношения сторон
      if (keepAspectRatio || pressedKeys.shiftKey) {
        updatedBox = updatedBox.setAspectRatio(box.aspectRatio);
      }

      // Поправка расположения
      updatedBox = resizingPoint.keepTransformOrigin(box, updatedBox);

      onChange(updatedBox, { pressedKeys, isDrag: false });
    },
    [onChange, box, sizesBounds, keepAspectRatio]
  );

  const resizingPoints = useMemo(() => getResizingPoints(thumbKeys), [thumbKeys]);

  return resizingPoints.map((resizingPoint, i) => {
    const key = thumbKeys[i];
   
    return (
      <Draggable
        key={String(key)}
        isCentered={true}
        value={box.denormalizePoint(resizingPoint)}
        onChange={(point, options) =>
          handleChangeThumb(resizingPoint, point, options)
        }
      >
        <Thumb />
      </Draggable>
    );
  });
}

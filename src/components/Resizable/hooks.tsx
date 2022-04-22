import { useCallback } from "react";
import { useDrag } from "../Draggable/hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { BoxSizesBounds } from "../../utils/boxSizesBounds";
import {
  getMovableElements,
  type IMovableElementKey,
} from "../../utils/boxResize";
import { MovableElement } from "../../utils/boxResize/movableElement";
import { Draggable } from "../Draggable";

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

  /** Ограничения размера элемента */
  sizesBounds: BoxSizesBounds;

  /** Менять размер, сохраняя соотношении длины и ширины */
  onlyRateably: boolean;

  /** Ключи отображаемых кнопок, за которые производится resize  */
  thumbKeys: readonly IMovableElementKey[];

  /** React компонент кнопки, за которую производится resize */
  Thumb: React.ComponentType<{
    movableElement: MovableElement
  }>;
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
  onlyRateably,
  thumbKeys,
  Thumb,
}: IResizeParams): React.ReactNode {
  const handleDrag = useCallback(
    (point: Point, pressedKeys: IPressedKeys) => {
      onChange(box.setOrigin(point), { pressedKeys, isDrag: true });
    },
    [onChange, box]
  );

  useDrag({ element: draggableElement, onChange: handleDrag });

  const handleChangeThumb = useCallback(
    (
      movable: MovableElement,
      dragPoint: Point,
      pressedKeys: IPressedKeys
    ) => {
      const updatedBox = movable.updateBox({
        point: dragPoint,
        box,
        sizesBounds,
        isRateably: onlyRateably || pressedKeys.shiftKey,
      });

      onChange(updatedBox, { pressedKeys, isDrag: false });
    },
    [onChange, box, sizesBounds, onlyRateably]
  );

  return getMovableElements(thumbKeys).map((movable, i) => {
    const key = thumbKeys[i];
   
    return (
      <Draggable
        key={String(key)}
        isCentered={true}
        value={movable.getPointInBox(box)}
        onChange={(point, options) =>
          handleChangeThumb(movable, point, options)
        }
      >
        <Thumb movableElement={movable}/>
      </Draggable>
    );
  });
}

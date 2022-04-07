import { useCallback } from "react";
import { IDragCallbackOptions, useDrag } from "../Draggable/hooks";
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

interface IProps<T> {
  box: BoundingBox;
  onChange(a: BoundingBox, options: IResizeCallbackOptions): void;
  draggableElement: T | null;
  sizesBounds: BoxSizesBounds;
  onlyRateably: boolean;
  thumbKeys: readonly IMovableElementKey[];
  thumbComponent: React.ComponentType<{}>;
}

/**
 * todo: Можно предусмотреть пропс, устанавливающий расположение кнопок: внутри бокса
 * или на том же уровне
 */

export function useResize<T extends HTMLElement>({
  box,
  draggableElement,
  onChange,
  sizesBounds,
  onlyRateably,
  thumbKeys,
  thumbComponent: ThumbComponent,
}: IProps<T>): React.ReactNode {
  const handleDrag = useCallback(
    (point: Point, { pressedKeys }: IDragCallbackOptions) => {
      onChange(box.setOrigin(point), { pressedKeys, isDrag: true });
    },
    [onChange, box]
  );

  useDrag({ element: draggableElement, onChange: handleDrag });

  const handleChangeThumb = useCallback(
    (
      movable: MovableElement,
      innerPoint: Point,
      { pressedKeys }: IDragCallbackOptions
    ) => {
      /** Т.к. кнопки располагаются внутри бокса, а не на том же уровне */
      const outerPoint = innerPoint.add(box!.origin);

      const updatedBox = movable.updateBox({
        point: outerPoint,
        box,
        sizesBounds,
        isRateably: onlyRateably || pressedKeys.shiftKey,
      });

      onChange(updatedBox, { pressedKeys, isDrag: false });
    },
    [onChange, box, sizesBounds, onlyRateably]
  );

  /** Т.к. кнопки располагаются внутри бокса, а не на том же уровне */
  const innerBox = box.moveToOrigin();

  return getMovableElements(thumbKeys).map((movable, i) => {
    const key = thumbKeys[i];
   
    return (
      <Draggable
        key={String(key)}
        isCentered={true}
        value={movable.getPointInBox(innerBox)}
        onChange={(point, options) =>
          handleChangeThumb(movable, point, options)
        }
      >
        <ThumbComponent />
      </Draggable>
    );
  });
}

import { identity } from "ramda";
import { useCallback, useEffect } from "react";
import { BoundingBox } from "../utils/boundingBox";
import { IPressedKeys, noop } from "../utils/common";
import { getBoxOnPage, getPointOnPage } from "../utils/dom";
import {
  DragCoordinatesListener,
  DragMovementListener,
  IDragCallback,
  IDragCallbacks,
} from "../utils/drag";
import { useActualRef } from "./useActualRef";

export interface IDragParams extends Partial<IDragCallbacks> {
  /** Перемещаемый элемент */
  element: HTMLElement | null;

  /** Оповещать об изменении координат элемента относительно его `offsetParent` */
  isInOwnCoordinates?: boolean;
}

export function useDragMovement({
  element,
  onChange = noop,
  onStart = noop,
  onEnd = noop,
}: IDragParams) {
  useEffect(() => {
    if (element) {
      const listener = new DragMovementListener(element, {
        onChange,
        onStart,
        onEnd,
      });

      return listener.launch();
    }
  }, [element, onChange, onStart, onEnd]);
}

export function useDrag({
  element,
  isInOwnCoordinates = true,
  onStart = noop,
  onChange = noop,
  onEnd = noop,
}: IDragParams) {
  /** Обертка, преобразующая координаты внутри страницы к координатам внутри offsetParent */
  const offsetParentDecorator = useCallback(
    (dndCallback: IDragCallback): IDragCallback => {
      return (point, pressedKeys) => {
        if (!element) {
          return;
        }

        const { offsetParent } = element;

        if (!offsetParent) {
          console.error("Не найден offsetParent");
          dndCallback(point, pressedKeys);
          return;
        }

        const offset = getPointOnPage(offsetParent);

        dndCallback(point.subtract(offset), pressedKeys);
      };
    },
    [element]
  );

  const wrapper = isInOwnCoordinates ? offsetParentDecorator : identity;

  useEffect(() => {
    if (element) {
      const listener = new DragCoordinatesListener(element, {
        onStart: wrapper(onStart),
        onChange: wrapper(onChange),
        onEnd: wrapper(onEnd),
      });

      return listener.launch();
    }
  }, [element, wrapper, onChange, onStart, onEnd]);
}

export interface IDragBoxCallback {
  (a: BoundingBox, pressedKeys: IPressedKeys): void;
}

export interface IDragBoxCallbacks {
  onStart: IDragBoxCallback;
  onChange: IDragBoxCallback;
  onEnd: IDragBoxCallback;
}

export interface IDragBoxParams
  extends Pick<IDragParams, "element" | "isInOwnCoordinates">,
    Partial<IDragBoxCallbacks> {
  // todo: мб лучше обрабатывать снаружи?
  /** Внешний бокс, в чьих пределах может перемещаться данный */
  outerBox?: BoundingBox;
}

export function useDragBox({
  onStart = noop,
  onChange = noop,
  onEnd = noop,
  ...rest
}: IDragBoxParams) {
  const paramsRef = useActualRef(rest);

  const wrapper = useCallback(
    (dndCallback: IDragBoxCallback): IDragCallback => {
      return (point, pressedKeys) => {
        const { outerBox, element } = paramsRef.current;
        const box = getBoxOnPage(element!).moveTo(point);

        dndCallback(outerBox ? outerBox.clampInner(box) : box, pressedKeys);
      };
    },
    [paramsRef]
  );

  return useDrag({
    ...rest,
    onStart: wrapper(onStart),
    onChange: wrapper(onChange),
    onEnd: wrapper(onEnd),
  });
}

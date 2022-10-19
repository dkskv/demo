import { identity, mapObjIndexed } from "ramda";
import { useCallback, useEffect, useMemo } from "react";
import { BoundingBox } from "../utils/boundingBox";
import { IPressedKeys, noop } from "../utils/common";
import { getBoxOnPage, getPointOnPage } from "../utils/dom";
import {
  DragCoordinatesListener,
  DragListener,
  DragMovementListener,
  IDragCallback,
  IDragCallbacks,
} from "../utils/drag";
import { useActualRef } from "./useActualRef";

export interface IDragParams extends Partial<IDragCallbacks> {
  /** Перемещаемый элемент */
  element: HTMLElement | null;
  /** Использовать координаты относительно `offsetParent` элемента */
  isInOwnCoordinates?: boolean;
}

function useDndListener(
  Listener: { new (element: Element): DragListener },
  element: Element | null,
  callbacks: IDragCallbacks
) {
  const instance = useMemo(
    () => element && new Listener(element),
    [Listener, element]
  );

  useEffect(() => instance?.launch(), [instance]);

  instance?.setCallbacks(callbacks);
}

export function useDragMovement({
  element,
  onChange = noop,
  onStart = noop,
  onEnd = noop,
}: IDragParams) {
  return useDndListener(DragMovementListener, element, {
    onStart,
    onChange,
    onEnd,
  });
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

  return useDndListener(
    DragCoordinatesListener,
    element,
    mapObjIndexed(wrapper, { onStart, onChange, onEnd })
  );
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

  const addBoxWrapper = useCallback(
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
    ...mapObjIndexed(addBoxWrapper, { onStart, onChange, onEnd }),
  });
}

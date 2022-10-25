import { identity, mapObjIndexed } from "ramda";
import { useCallback, useEffect, useMemo } from "react";
import { BoundingBox } from "../utils/boundingBox";
import { noop } from "../utils/common";
import { getBoxOnPage, getPointOnPage } from "../utils/dom";
import {
  DragListener,
  IDragCallback,
  IDragCallbacks,
  IDragEvent,
} from "../utils/drag";
import { useActualRef } from "./useActualRef";

export interface IDragParams extends Partial<IDragCallbacks> {
  /** Перемещаемый элемент */
  element: HTMLElement | null;
  /** Использовать координаты относительно `offsetParent` элемента */
  isInOwnCoordinates?: boolean;
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
    (dndCallback: IDragCallback): IDragCallback =>
      (event) => {
        const { offsetParent } = event.element;

        if (!offsetParent) {
          console.error("Не найден offsetParent");
          return;
        }

        const offset = getPointOnPage(offsetParent);
        dndCallback({ ...event, point: event.point.subtract(offset) });
      },
    []
  );

  const wrapper = isInOwnCoordinates ? offsetParentDecorator : identity;

  const listener = useMemo(
    () => (element ? new DragListener(element) : null),
    [element]
  );

  useEffect(() => listener?.launch(), [listener]);

  listener?.setCallbacks(mapObjIndexed(wrapper, { onStart, onChange, onEnd }));
}

interface IDragBoxEvent extends IDragEvent {
  box: BoundingBox;
}

export interface IDragBoxCallback {
  (e: IDragBoxEvent): void;
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
    (dndCallback: IDragBoxCallback): IDragCallback =>
      (event) => {
        const { outerBox } = paramsRef.current;
        const box = getBoxOnPage(event.element).moveTo(event.point);

        dndCallback({
          ...event,
          box: outerBox ? outerBox.clampInner(box) : box,
        });
      },
    [paramsRef]
  );

  return useDrag({
    ...rest,
    ...mapObjIndexed(addBoxWrapper, { onStart, onChange, onEnd }),
  });
}

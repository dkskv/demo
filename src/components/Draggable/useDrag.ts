import { identity, mapObjIndexed } from "ramda";
import { useCallback, useEffect, useMemo } from "react";
import { noop } from "../../utils/common";
import { getPointOnViewport } from "../../utils/dom";
import { DragListener, IDragCallback, IDragCallbacks } from "../../utils/drag";
import { IDragSettings } from "./index.types";

interface IParams extends IDragCallbacks, IDragSettings {
  element: HTMLElement | null;
}

export function useDrag({
  element,
  isInOwnCoordinates = true,
  onChange,
  onStart = noop,
  onEnd = noop,
}: IParams) {
  /** Обертка, преобразующая координаты внутри страницы к координатам внутри offsetParent */
  const offsetParentDecorator = useCallback(
    (dndCallback: IDragCallback): IDragCallback =>
      (event) => {
        const { offsetParent } = event.element;

        if (!offsetParent) {
          console.error("Не найден offsetParent");
          return;
        }

        const offset = getPointOnViewport(offsetParent);
        dndCallback({ ...event, point: event.point.subtract(offset) });
      },
    []
  );

  const listener = useMemo(
    () => (element ? new DragListener(element) : null),
    [element]
  );

  useEffect(() => listener?.launch(), [listener]);

  const wrapper = isInOwnCoordinates ? offsetParentDecorator : identity;
  listener?.setCallbacks(mapObjIndexed(wrapper, { onStart, onChange, onEnd }));
}

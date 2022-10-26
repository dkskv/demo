import { mapObjIndexed } from "ramda";
import { useCallback } from "react";
import { useActualRef } from "../../decorators/useActualRef";
import { noop } from "../../utils/common";
import { getBoxOnPage } from "../../utils/dom";
import { IDragCallback } from "../../utils/drag";
import { useDrag } from "../Draggable/useDrag";
import {
  IDragBoxCallback,
  IDragBoxCallbacks,
  IDragBoxSettings,
} from "./index.types";

interface IParams extends IDragBoxCallbacks, IDragBoxSettings {
  element: HTMLElement | null;
}

export function useDragBox({
  onStart = noop,
  onChange = noop,
  onEnd = noop,
  ...rest
}: IParams) {
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

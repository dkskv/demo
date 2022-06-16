import { useCallback, useEffect } from "react";
import { noop } from "../../utils/common";
import { getPointOnPage } from "../../utils/dom";
import {
  DragCoordinatesListener,
  DragMovementListener,
  IDragCallbacks,
} from "../../utils/drag";

export interface IDragParams extends Partial<IDragCallbacks> {
  /** Перемещаемый элемент */
  element: HTMLElement | null;
}

// todo: Видимо, придется переносить useDragBox сюда (чтобы ограничивать в outerBox)
/**
 * Подписаться на перемещение HTML элемента в координатах родителя,
 * относительно которого позиционируется перемещаемый элемент.
 */
export function useDrag({
  element,
  onChange = noop,
  onStart = noop,
  onEnd = noop,
}: IDragParams) {
  /** Обертка, преобразующая координаты внутри страницы к координатам внутри offsetParent */
  const handleChange: IDragCallbacks["onChange"] = useCallback(
    (point, pressedKeys) => {
      if (!element) {
        return;
      }

      const { offsetParent } = element;

      if (!offsetParent) {
        console.error("Не найден offsetParent");
        onChange(point, pressedKeys);
        return;
      }

      const offset = getPointOnPage(offsetParent);
      onChange(point.subtract(offset), pressedKeys);
    },
    [element, onChange]
  );

  useEffect(() => {
    if (element) {
      const listener = new DragCoordinatesListener(element, {
        onChange: handleChange,
        onStart,
        onEnd,
      });

      return listener.launch();
    }
  }, [element, handleChange, onStart, onEnd]);
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

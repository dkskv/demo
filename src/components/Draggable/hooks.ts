import { useCallback, useEffect } from "react";
import { noop } from "../../utils/common";
import { getPointOnPage } from "../../utils/domElement";
import { DragListener, IDragCallbacks } from "../../utils/drag";

export interface IDragParams extends Partial<IDragCallbacks> {
  /** Перемещаемый элемент */
  element: HTMLElement | null;
}

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
      const offset = getPointOnPage(element!.offsetParent!);

      onChange(point.subtract(offset), pressedKeys);
    },
    [element, onChange]
  );

  useEffect(() => {
    if (element) {
      const listener = new DragListener(element, {
        onChange: handleChange,
        onStart,
        onEnd,
      });

      listener.launch();

      return () => listener.stop();
    }
  }, [element, handleChange, onStart, onEnd]);
}
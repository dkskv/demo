import { useCallback, useEffect } from "react";
import { getPointOnPage } from "../../utils/domElement";
import { IDragCallback, listenDrag } from "../../utils/drag";

interface IProps {
  /** Перемещаемый элемент */
  element: HTMLElement | null;
  /** Callback, вызываемый при намерении переместить элемент */
  onChange: IDragCallback;
}

/**
 * Подписаться на перемещение HTML элемента в координатах родителя,
 * относительно которого позиционируется перемещаемый элемент.
 */
export function useDrag({ element, onChange }: IProps) {
  /** Обертка, преобразующая координаты к внутренним */
  const handleChange: IDragCallback = useCallback(
    (point, pressedKeys) => {
      const offsetParentPoint = getPointOnPage(element!.offsetParent!);

      onChange(point.subtract(offsetParentPoint), pressedKeys);
    },
    [element, onChange]
  );

  useEffect(() => {
    if (element) {
      const callback = listenDrag(element, handleChange);

      element.addEventListener("mousedown", callback);

      return () => {
        element.removeEventListener("mousedown", callback);
      };
    }
  }, [element, handleChange]);
}

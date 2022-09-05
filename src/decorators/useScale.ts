import { useCallback, useEffect } from "react";
import { getBoxOnPage, getMouseOffsetPoint } from "../utils/dom";
import { Point } from "../utils/point";

export function useScale(
  element: Element | null,
  onChange: (delta: number, point: Point) => void
) {
  const handleChange = useCallback(
    (event: Event) => {
      event.stopPropagation();
      event.preventDefault();

      const { deltaY } = event as WheelEvent;

      const targetBox = getBoxOnPage(event.currentTarget as Element);
      const offsetPoint = getMouseOffsetPoint(event as WheelEvent);

      onChange(deltaY, targetBox.resetOrigin().normalizePoint(offsetPoint));
    },
    [onChange]
  );

  useEffect(() => {
    if (element) {
      element.addEventListener("wheel", handleChange);

      return () => {
        element.removeEventListener("wheel", handleChange);
      };
    }
  }, [element, handleChange]);
}

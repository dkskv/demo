import { useCallback, useEffect, useRef } from "react";
import { extractPressedKeys, IPressedKeys, noop } from "../utils/common";
import { getBoxOnPage, getMouseOffsetPoint } from "../utils/dom";
import { Point } from "../utils/point";

interface IParams {
  onChange(
    delta: number,
    scalingOrigin: Point,
    pressedKeys: IPressedKeys
  ): void;
  onStart?(scalingOrigin: Point, pressedKeys: IPressedKeys): void;
  onEnd?(scalingOrigin: Point, pressedKeys: IPressedKeys): void;
  delayToEnd?: number;
}

export function useScale(
  element: Element | null,
  { onChange, onStart = noop, onEnd = noop, delayToEnd = 400 }: IParams
) {
  const timerId = useRef<NodeJS.Timer>();

  const handleChange = useCallback(
    (event: Event) => {
      const wheelEvent = event as WheelEvent;

      wheelEvent.stopPropagation();
      wheelEvent.preventDefault();

      const targetBox = getBoxOnPage(wheelEvent.currentTarget as Element);
      const offsetPoint = getMouseOffsetPoint(wheelEvent);

      const scalingOrigin = targetBox.resetOrigin().normalizePoint(offsetPoint);
      const pressedKeys = extractPressedKeys(wheelEvent);

      if (timerId.current === undefined) {
        onStart(scalingOrigin, pressedKeys);
      }

      onChange(wheelEvent.deltaY, scalingOrigin, pressedKeys);

      timerId.current && clearTimeout(timerId.current);

      timerId.current = setTimeout(() => {
        timerId.current = undefined;
        onEnd(scalingOrigin, pressedKeys);
      }, delayToEnd);
    },
    [onChange, onStart, onEnd, delayToEnd]
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

import { useCallback, useEffect, useRef } from "react";
import { noop } from "../utils/common";
import {
  extractPressedKeys,
  getBoxOnPage,
  getMouseOffsetPoint,
  IPressedKeys,
} from "../utils/dom";
import { Point } from "../utils/point";

export interface IScaleEvent {
  scalingK: number;
  origin: Point;
  pressedKeys: IPressedKeys;
}

interface IParams {
  onChange(e: IScaleEvent): void;
  onStart?(e: IScaleEvent): void;
  onEnd?(e: IScaleEvent): void;
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

      const origin = targetBox.resetOrigin().normalizePoint(offsetPoint);
      const pressedKeys = extractPressedKeys(wheelEvent);

      if (timerId.current === undefined) {
        onStart({ scalingK: 0, origin, pressedKeys });
      }

      onChange({
        scalingK: defineWheelScalingK(wheelEvent.deltaY),
        origin,
        pressedKeys,
      });

      timerId.current && clearTimeout(timerId.current);

      timerId.current = setTimeout(() => {
        timerId.current = undefined;
        onEnd({ scalingK: 0, origin, pressedKeys });
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

function defineWheelScalingK(wheelDeltaY: number, sensitivity = 0.001) {
  return 1 + wheelDeltaY * sensitivity;
}

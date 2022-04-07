import { useEffect } from "react";
import { IPressedKeys } from "../../utils/common";
import { listenDrag } from "../../utils/drag";
import { Point } from "../../utils/point";

export interface IDragCallbackOptions {
  pressedKeys: IPressedKeys;
}

interface IProps<T> {
  element: T | null;
  onChange(point: Point, options: IDragCallbackOptions): void;
}

export function useDrag<T extends HTMLElement>({
  element,
  onChange,
}: IProps<T>) {
  useEffect(() => {
    if (element) {
      const dragHandler = listenDrag(element, onChange);

      element.addEventListener("mousedown", dragHandler);

      return () => {
        element.removeEventListener("mousedown", dragHandler);
      };
    }
  }, [element, onChange]);
}

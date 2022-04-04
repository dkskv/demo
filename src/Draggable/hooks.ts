import { useEffect } from "react";
import { IPressedKeys } from "../utils/common";
import { Point } from "../utils/point";
import { createDragHandler } from "./utils";

interface IProps<T> {
  element: T | null;
  onChange(point: Point, options: { pressedKeys: IPressedKeys }): void;
}

export function useDrag<T extends HTMLElement>({
  element,
  onChange,
}: IProps<T>) {
  useEffect(() => {
    if (element) {
      const area = element.parentElement;

      const dragHandler = createDragHandler(area!, element, onChange);

      element.addEventListener("mousedown", dragHandler);

      return () => {
        element.removeEventListener("mousedown", dragHandler);
      };
    }
  }, [element, onChange]);
}

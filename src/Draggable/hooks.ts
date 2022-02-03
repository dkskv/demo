import { useEffect } from "react";
import { IPressedKeys } from "../utils/common";
import { IPosition } from "../utils/geometry";
import { createDragHandler } from "./utils";

interface IProps<T> {
  element: T | null;
  onChange(position: IPosition, options: { pressedKeys: IPressedKeys }): void;
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

      return () => element.removeEventListener("mousedown", dragHandler);
    }
  }, [element, onChange]);
}

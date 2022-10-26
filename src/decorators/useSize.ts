import { useEffect, useState } from "react";
import { getBoxByDomRect } from "../utils/dom";
import { Size } from "../entities/size";

export function useSize(element: HTMLElement | null) {
  const [size, setSize] = useState(() => Size.nullish());

  useEffect(() => {
    if (element) {
      const observer = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;

        if (rect) {
          setSize(getBoxByDomRect(rect).size);
        }
      });

      observer.observe(element);

      return () => observer.unobserve(element);
    }
  }, [element]);

  return size;
}

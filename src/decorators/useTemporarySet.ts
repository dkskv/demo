import { useCallback, useEffect, useRef } from "react";
import { useForceUpdate } from "./useForceUpdate";

/**
 * `Set`, элементы которого удаляются через заданное время.
 * Изменения в `Set` вызывают обновление компонента.
 */
export function useTemporarySet<T>() {
  const collectionRef = useRef(new Set());

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(
    () => () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const forceUpdate = useForceUpdate();

  const add = useCallback(
    (value: T, dur: number) => {
      collectionRef.current.add(value);
      forceUpdate();

      timeoutRef.current = setTimeout(() => {
        collectionRef.current.delete(value);
        forceUpdate();
      }, dur);
    },
    [forceUpdate]
  );

  const getAddingIndex = useCallback((value: T) => {
    return collectionRef.current.has(value)
      ? Array.from(collectionRef.current.values()).indexOf(value)
      : -1;
  }, []);

  const getSize = useCallback(() => collectionRef.current.size, []);

  return { add, getAddingIndex, getSize };
}

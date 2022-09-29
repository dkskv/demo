import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForceUpdate } from "../../decorators/useForceUpdate";

export interface ITemporarySet<T> {
  add(k: T): void;
  getOrder(k: T): number;
  size: number;
}

/**
 * `Set`, элементы которого удаляются через заданное время.
 * Изменения в `Set` вызывают обновление компонента.
 */
export function useTemporarySet<T>(expirationTime: number): ITemporarySet<T> {
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
    (value: T) => {
      collectionRef.current.add(value);
      forceUpdate();

      timeoutRef.current = setTimeout(() => {
        collectionRef.current.delete(value);
        forceUpdate();
      }, expirationTime);
    },
    [forceUpdate, expirationTime]
  );

  const getOrder = useCallback((value: T) => {
    return collectionRef.current.has(value)
      ? Array.from(collectionRef.current.values()).indexOf(value)
      : -1;
  }, []);

  const { size } = collectionRef.current;

  return useMemo(() => ({ add, getOrder, size }), [add, getOrder, size]);
}

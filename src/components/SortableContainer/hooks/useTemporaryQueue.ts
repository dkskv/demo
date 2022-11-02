import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForceUpdate } from "../../../decorators/useForceUpdate";

export interface ITemporaryQueue<T> {
  push(k: T): void;
  getOrder(k: T): number;
}

/**
 * Очередь, элементы которой удаляются через заданное время.
 * Изменение набора элементов вызывает рендеринг компонента.
 */
export function useTemporaryQueue<T>(
  expirationTime: number
): ITemporaryQueue<T> {
  const collection = useState<T[]>(() => [])[0];
  const timeout = useRef<NodeJS.Timeout>();
  const forceUpdate = useForceUpdate();

  useEffect(
    () => () => {
      if (timeout.current !== undefined) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  const push = useCallback(
    (value: T) => {
      collection.push(value);
      forceUpdate();

      timeout.current = setTimeout(() => {
        collection.splice(collection.indexOf(value), 1);
        forceUpdate();
      }, expirationTime);
    },
    [collection, expirationTime, forceUpdate]
  );

  const getOrder = useCallback(
    (value: T) => collection.indexOf(value),
    [collection]
  );

  return useMemo(() => ({ push, getOrder }), [push, getOrder]);
}

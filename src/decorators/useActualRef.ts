import { useRef } from "react";

/** Оптимизация: чтобы не указывать зависимость для callback'а */
export function useActualRef<T>(value: T) {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}

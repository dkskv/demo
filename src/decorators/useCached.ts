import { useRef } from "react";

// todo: Удалить
export function useCached<T>(value: T) {
  const ref = useRef(value);

  if (value) {
    ref.current = value;
  }

  return value ?? ref.current;
}

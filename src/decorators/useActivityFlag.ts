import { compose } from "ramda";
import { useCallback } from "react";
import { useBooleanState } from "./useBooleanState";

export function useActivityFlag<
  S extends (...args: any) => any,
  E extends (...args: any) => any
>(onStart: S, onEnd: E) {
  const [isActive, setIsActive, setIsInactive] = useBooleanState(false);

  return [
    isActive,
    {
      onStart: useCallback(compose(setIsActive, onStart) as S, [onStart]),
      onEnd: useCallback(compose(setIsInactive, onEnd) as E, [onEnd]),
    },
  ] as const;
}

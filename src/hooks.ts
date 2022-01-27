import { useCallback, useState } from "react";

export function useCallbackRef<T extends HTMLElement>() {
  return useState<T | null>(null);
}

export function useBindCallbackProp<
  P,
  A extends any[],
  C extends (p: P, ...args: A) => void
>(callback: C, callbackProp: P) {
  return useCallback(
    (...args: A) => {
      callback(callbackProp, ...args);
    },
    [callbackProp, callback]
  );
}

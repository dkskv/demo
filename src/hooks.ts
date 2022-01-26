import { useCallback, useState } from "react";

export function useCallbackRef<T extends HTMLElement>() {
  return useState<T | null>(null);
}

export function useNamedCallback<T, U>(
  callback: (name: T, ...args: U[]) => void,
  name: T
) {
  return useCallback(
    (...args: U[]) => {
      callback(name, ...args);
    },
    [name, callback]
  );
}
import { inc } from "ramda";
import { useReducer } from "react";

export function useForceUpdate() {
  return useReducer(inc, 0)[1];
}

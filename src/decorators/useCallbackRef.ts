import { useState } from "react";

export function useCallbackRef<T extends HTMLElement>() {
  return useState<T | null>(null);
}


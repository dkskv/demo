import { useCallback } from "react";

export function useControlButtonsHandlers(
  offset: number,
  updater: (fn: (value: number) => number) => void
) {
  const handleBack = useCallback(() => {
    updater(position => position - offset);
  }, [updater, offset]);

  const handleForward = useCallback(() => {
    updater(position => position + offset);
  }, [updater, offset]);

  return { back: handleBack, forward: handleForward };
}

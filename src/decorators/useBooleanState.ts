import { useCallback, useState } from "react";

export function useBooleanState(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);

  const makeTrue = useCallback(() => {
    setValue(true);
  }, []);

  const makeFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, makeTrue, makeFalse] as const;
}

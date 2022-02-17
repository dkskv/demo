import { useCallback, useState } from "react";
import { IConverter } from "./utils";

export function useTwoWayBinding<A, B, U>(
  initialUniversalValue: U,
  [converterA, converterB]: [IConverter<A, U>, IConverter<B, U>]
) {
  const [universalValue, setUniversalValue] = useState(initialUniversalValue);

  const handleAChange = useCallback(
    (value: A) => setUniversalValue(converterA.toUni(value)),
    [converterA]
  );

  const handleBChange = useCallback(
    (value: B) => setUniversalValue(converterB.toUni(value)),
    [converterB]
  );

  const aValue = converterA.toSrc(universalValue);
  const bValue = converterB.toSrc(universalValue);

  return {
    values: [aValue, bValue] as const,
    callbacks: [handleAChange, handleBChange] as const,
  } as const;
}

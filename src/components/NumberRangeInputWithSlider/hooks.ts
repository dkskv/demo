import { useCallback } from "react";
import { IConverter } from "./utils";

/** Связывает 2 значения через промежуточное */
export function useTwoWayBinding<A, B, U>(
  universalValue: U,
  onChange: (v: U) => void,
  [converterA, converterB]: [IConverter<A, U>, IConverter<B, U>]
) {
  const handleAChange = useCallback(
    (value: A) => onChange(converterA.toUni(value)),
    [converterA, onChange]
  );

  const handleBChange = useCallback(
    (value: B) => onChange(converterB.toUni(value)),
    [converterB, onChange]
  );

  const aValue = converterA.toSrc(universalValue);
  const bValue = converterB.toSrc(universalValue);

  return {
    values: [aValue, bValue] as const,
    callbacks: [handleAChange, handleBChange] as const,
  } as const;
}

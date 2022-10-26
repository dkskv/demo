import { equals } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { useActualRef } from "./useActualRef";

export interface IConverter<TOriginalValue, TSmoothValue> {
  normalize(x: TOriginalValue): TSmoothValue;
  denormalize(a: TSmoothValue): TOriginalValue;
}

interface IParams<TOriginalValue, TSmoothValue> {
  /** Оригинальное значение */
  value: TOriginalValue;
  /** Callback на изменение оригинального значения */
  onChange(value: TOriginalValue): void;
  /** Конвертер между оригинальным значением и `smooth` значением */
  converter: IConverter<TOriginalValue, TSmoothValue>;
}

/** Использовать более плавный способ управлять значением */
export function useSmoothControl<TOriginalValue, TSmoothValue>({
  value: originalValue,
  onChange,
  converter,
}: IParams<TOriginalValue, TSmoothValue>) {
  const [isActive, setIsActive] = useState(false);
  const [smoothValue, setSmoothValue] = useState(() =>
    converter.normalize(originalValue)
  );
  const actualExternalValue = useActualRef(originalValue);

  const handleControlChange = useCallback(
    (nextSmoothValue: TSmoothValue) => {
      setIsActive(true);
      setSmoothValue(nextSmoothValue);

      const outputValue = converter.denormalize(nextSmoothValue);

      if (!equals(actualExternalValue.current, outputValue)) {
        onChange(outputValue);
      }
    },
    [actualExternalValue, converter, onChange]
  );

  const handleControlEnd = useCallback(() => {
    setIsActive(false);
  }, []);

  /** Эффект сброса значения из state, если оно не соответствует значению из props */
  useEffect(() => {
    if (!isActive) {
      setSmoothValue(converter.normalize(originalValue));
    }
  }, [isActive, originalValue, converter]);

  return {
    smoothValue,
    onChange: handleControlChange,
    onEnd: handleControlEnd,
  } as const;
}

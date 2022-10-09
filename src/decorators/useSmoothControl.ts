import { equals } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { IConverter } from "../utils/converter";
import { useActualRef } from "./useActualRef";

interface IParams<ControlValue, Value> {
  /** Целевое значение */
  value: Value;
  /** Callback на изменение целевого значения */
  onChange(value: Value): void;
  /** Конвертер из альтернативного значения в целевое */
  converter: IConverter<ControlValue, Value>;
  // todo: вынести наружу
  isSmooth: boolean;
}

/** Использовать более плавный способ управлять значением */
export function useSmoothControl<ControlValue, Value>({
  value: externalValue,
  onChange,
  converter,
  isSmooth,
}: IParams<ControlValue, Value>) {
  const [isActive, setIsActive] = useState(false);
  const [selfValue, setSelfValue] = useState(() =>
    converter.fromDestination(externalValue)
  );
  const actualExternalValue = useActualRef(externalValue);

  const handleControlChange = useCallback(
    (nextSelfValue: ControlValue) => {
      setIsActive(true);
      setSelfValue(nextSelfValue);

      const outputValue = converter.toDestination(nextSelfValue);

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
      setSelfValue(converter.fromDestination(externalValue));
    }
  }, [isActive, externalValue, converter]);

  return {
    controlValue: isSmooth
      ? selfValue
      : converter.fromDestination(externalValue),
    handleControlChange,
    handleControlEnd,
  } as const;
}

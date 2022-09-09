import { equals } from "ramda";
import { useCallback, useEffect, useRef, useState } from "react";
import { IConverter } from "../utils/converter";

interface IParams<ControlValue, Value> {
  /** Целевое значение */
  value: Value;
  /** Callback на изменение целевого значения */
  onChange(value: Value): void;
  /** Конвертер из альтернативного значения в целевое */
  converter: IConverter<ControlValue, Value>;

  isSmooth: boolean;
}

/** Использовать более плавный способ управлять значением */
export function useSmoothControl<ControlValue, Value>({
  value,
  onChange,
  converter,
  isSmooth,
}: IParams<ControlValue, Value>) {
  // todo: переименовать в selfValue?
  const [controlValue, setControlValue] = useState(() =>
    converter.fromDestination(value)
  );

  const actualValue = useRef(value);

  const handleControlChange = useCallback(
    (value: ControlValue) => {
      setControlValue(value);

      const outputValue = converter.toDestination(value);

      if (!equals(actualValue.current, outputValue)) {
        onChange(outputValue);
      }
    },
    [converter, onChange]
  );

  const handleControlEnd = useCallback(
    (value: ControlValue) => {
      setControlValue(
        converter.fromDestination(converter.toDestination(value))
      );
    },
    [converter]
  );

  // /** Эффект сброса значения из state, если оно не соответствует значению из props */
  useEffect(() => {
    setControlValue((controlValue) => {
      const propsControlValue = converter.fromDestination(value);

      return equals(
        converter.toDestination(controlValue),
        converter.toDestination(propsControlValue)
      )
        ? controlValue
        : propsControlValue;
    });
  }, [value, converter]);

  return {
    controlValue: isSmooth ? controlValue : converter.fromDestination(value),
    handleControlChange,
    handleControlEnd,
  } as const;
}

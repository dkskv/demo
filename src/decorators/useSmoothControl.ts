import { equals } from "ramda";
import { useCallback, useState } from "react";
import { IConverter } from "../utils/converter";

interface IParams<ControlValue, Value> {
  /** Целевое значение */
  value: Value;
  /** Callback на изменение целевого значения */
  onChange(value: Value): void;
  /** Конвертер из альтернативного значения в целевое */
  converter: IConverter<ControlValue, Value>;

  isSmooth: boolean;
  /**
   * @deprecated Функция сравнения двух целевых значений, чтобы не вызывать callback,
   * если изменения альтернативного значения не повлияло на целевое
   */
  isChanged?(v1: Value, v2: Value): boolean;
}

/** Использовать более плавный способ управлять значением */
export function useSmoothControl<ControlValue, Value>({
  value,
  onChange,
  converter,
  isSmooth,
  isChanged = equals,
}: IParams<ControlValue, Value>) {
  const [controlValue, setControlValue] = useState(
    converter.fromDestination(value)
  );

  const handleControlChange = useCallback(
    (value: ControlValue) => {
      setControlValue((prevValue) => {
        const outputValue = converter.toDestination(value);

        if (isChanged(outputValue, converter.toDestination(prevValue))) {
          onChange(outputValue);
        }

        return value;
      });
    },
    [converter, isChanged, onChange]
  );

  const handleControlEnd = useCallback(
    (value: ControlValue) => {
      setControlValue(
        converter.fromDestination(converter.toDestination(value))
      );
    },
    [converter]
  );

  const handleChange = useCallback(
    (value: Value) => {
      onChange(value);
      setControlValue(converter.fromDestination(value));
    },
    [converter, onChange]
  );

  return {
    controlValue: isSmooth ? controlValue : converter.fromDestination(value),
    handleControlChange,
    handleControlEnd,
    handleChange,
  } as const;
}

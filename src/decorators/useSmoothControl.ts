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
  /** Должно ли значение control'а меняться только при изменении целевого значения */
  isDiscrete?: boolean;
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
  isDiscrete = false,
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

  const handleChange = useCallback(
    (value: Value) => {
      onChange(value);
      setControlValue(converter.fromDestination(value));
    },
    [converter, onChange]
  );

  const outputControlValue = isDiscrete
    ? converter.fromDestination(value)
    : controlValue;

  return [outputControlValue, handleControlChange, handleChange] as const;
}

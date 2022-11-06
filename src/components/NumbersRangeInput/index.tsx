import { CSSProperties, useCallback } from "react";
import { NumbersRange } from "../../entities/numbersRange";
import { IDirection } from "../../entities/direction";
import { Space } from "../Space";
import { InputNumber } from "../InputNumber";

export interface INumbersRangeInputProps {
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  /** Диапазон минимального и максимального значений */
  bounds?: NumbersRange;
  direction?: IDirection;
  sizeLimits?: NumbersRange;
  inputStyle?: CSSProperties;
  children?: React.ReactNode;
}

export const NumbersRangeInput: React.FC<INumbersRangeInputProps> = ({
  value: range,
  bounds = NumbersRange.infinite(),
  onChange,
  direction,
  children,
  sizeLimits = NumbersRange.infinite(),
  inputStyle,
}) => {
  const handleChangeMinValue = useCallback(
    (value: number) =>
      onChange(
        range
          .setMin(Math.min(range.max, value))
          .constrainSize(sizeLimits)
          .moveTo(range.max, range.normalizeNumber(range.max))
      ),
    [range, sizeLimits, onChange]
  );

  const handleChangeMaxValue = useCallback(
    (value: number) =>
      onChange(
        range
          .setMax(Math.max(range.min, value))
          .constrainSize(sizeLimits)
          .moveTo(range.min, range.normalizeNumber(range.min))
      ),
    [range, sizeLimits, onChange]
  );

  return (
    <Space direction={direction} size={20} align="center">
      <InputNumber
        onChange={handleChangeMinValue}
        value={range.min}
        min={bounds.start}
        max={bounds.end}
        style={inputStyle}
      />
      {children}
      <InputNumber
        onChange={handleChangeMaxValue}
        value={range.max}
        min={bounds.start}
        max={bounds.end}
        style={inputStyle}
      />
    </Space>
  );
};

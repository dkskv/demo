import { useCallback } from "react";
import { NumbersRange } from "../../entities/numbersRange";
import { IDirection } from "../../entities/direction";
import { Space } from "../Space";

export interface INumbersRangeInputProps {
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  /** Диапазон минимального и максимального значений */
  bounds?: NumbersRange;
  direction?: IDirection;

  sizeLimits?: NumbersRange;
}

export const NumbersRangeInput: React.FC<INumbersRangeInputProps> = ({
  value: range,
  bounds = NumbersRange.infinite(),
  onChange,
  direction,
  children,
  sizeLimits = NumbersRange.infinite(),
}) => {
  const handleChangeMinValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      onChange(
        range
          .setMin(Math.min(range.max, value))
          .constrainSize(sizeLimits)
          .moveTo(range.max, range.normalizeNumber(range.max))
      );
    },
    [range, sizeLimits, onChange]
  );

  const handleChangeMaxValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      onChange(
        range
          .setMax(Math.max(range.min, value))
          .constrainSize(sizeLimits)
          .moveTo(range.min, range.normalizeNumber(range.min))
      );
    },
    [range, sizeLimits, onChange]
  );

  return (
    <Space direction={direction} size={20} align="center">
      <input
        type="number"
        onChange={handleChangeMinValue}
        value={range.min}
        min={bounds.start}
        max={bounds.end}
      />
      {children}
      <input
        type="number"
        onChange={handleChangeMaxValue}
        value={range.max}
        min={bounds.start}
        max={bounds.end}
      />
    </Space>
  );
};

import { useCallback } from "react";
import { NumbersRange } from "../../utils/numbersRange";
import { IDirection } from "../../utils/direction";
import { Space } from "../Space";

export interface INumbersRangeInputProps {
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  /** Диапазон минимального и максимального значений */
  bounds?: NumbersRange;
  /** Минимальный и максимальный размер диапазона */
  sizeBounds?: NumbersRange;

  direction?: IDirection;
}

const NumbersRangeInput: React.FC<INumbersRangeInputProps> = ({
  value: range,
  bounds = NumbersRange.infinite(),
  sizeBounds = NumbersRange.infinite(),
  onChange,
  direction,
  children,
}) => {
  const handleChangeStartValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      onChange(
        range.setStart(value).constrainSize(sizeBounds).moveTo(range.end, 1)
      );
    },
    [range, sizeBounds, onChange]
  );

  const handleChangeEndValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      onChange(
        range.setEnd(value).constrainSize(sizeBounds).moveTo(range.start, 0)
      );
    },
    [range, sizeBounds, onChange]
  );

  return (
    <Space direction={direction} size={20}>
      <input
        type="number"
        onChange={handleChangeStartValue}
        value={range.start}
        min={bounds.start}
        max={bounds.end}
      />
      {children}
      <input
        type="number"
        onChange={handleChangeEndValue}
        value={range.end}
        min={bounds.start}
        max={bounds.end}
      />
    </Space>
  );
};

export default NumbersRangeInput;

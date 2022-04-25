import { useCallback } from "react";
import { NumbersRange } from "../../utils/numbersRange";

export interface INumbersRangeInputProps {
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  /** Диапазон минимального и максимального значений */
  bounds?: NumbersRange;
  /** Минимальный и максимальный размер диапазона */
  sizeBounds?: NumbersRange;
}

const NumbersRangeInput: React.FC<INumbersRangeInputProps> = ({
  value: range,
  bounds = NumbersRange.infinite(),
  sizeBounds = NumbersRange.infinite(),
  onChange,
  children,
}) => {
  const handleChangeStart = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        range.setStart(Number(event.target.value)).constrainStart(sizeBounds)
      );
    },
    [range, sizeBounds, onChange]
  );

  const handleChangeEnd = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        range.setEnd(Number(event.target.value)).constrainEnd(sizeBounds)
      );
    },
    [range, sizeBounds, onChange]
  );

  return (
    // todo: менять стиль в зависимости от ориентации
    <div style={{ display: "flex", columnGap: "12px" }}>
      <input
        type="number"
        onChange={handleChangeStart}
        value={range.start}
        min={bounds.start}
        max={bounds.end}
      />
      {children}
      <input
        type="number"
        onChange={handleChangeEnd}
        value={range.end}
        min={bounds.start}
        max={bounds.end}
      />
    </div>
  );
};

export default NumbersRangeInput;

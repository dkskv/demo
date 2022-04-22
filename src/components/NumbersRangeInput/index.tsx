import { useCallback } from "react";
import { NumbersRange } from "../../utils/numbersRange";

export interface INumbersRangeInputProps {
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  /** диапазон минимального и максимального значений */
  bounds?: NumbersRange;
  // todo: ограничить только положительными значениями
  /** минимальный и максимальный размер диапазона */
  sizeBounds?: NumbersRange;
}

const NumbersRangeInput: React.VFC<INumbersRangeInputProps> = (props) => {
  const {
    value: range,
    bounds = NumbersRange.infinite(),
    sizeBounds = NumbersRange.infinite(),
    onChange,
  } = props;

  const handleChangeStart = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        range
          .setStart(Number(event.target.value))
          .constrainStart(sizeBounds)
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
    <div>
      <input
        type="number"
        onChange={handleChangeStart}
        value={range.start}
        min={bounds.start}
        max={bounds.end}
      />
      -
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

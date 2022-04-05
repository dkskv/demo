import { useCallback } from "react";
import { Bounds } from "../utils/bounds";
import { Range } from "../utils/range";

export interface INumbersRangeInputProps {
  value: Range;
  onChange(value: Range): void;
  /** диапазон минимального и максимального значений */
  bounds?: Bounds;
  // todo: ограничить только положительными значениями
  /** минимальный и максимальный размер диапазона */
  sizeBounds?: Bounds;
}

const NumbersRangeInput: React.VFC<INumbersRangeInputProps> = (props) => {
  const {
    value: range,
    bounds = Bounds.without(),
    sizeBounds = Bounds.without(),
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
        min={bounds.min}
        max={bounds.max}
      />
      -
      <input
        type="number"
        onChange={handleChangeEnd}
        value={range.end}
        min={bounds.min}
        max={bounds.max}
      />
    </div>
  );
};

export default NumbersRangeInput;

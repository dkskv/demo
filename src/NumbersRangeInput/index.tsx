import { useCallback } from "react";
import { Constraints } from "../utils/constraints";
import { Range } from "../utils/range";

export interface INumbersRangeInputProps {
  value: Range;
  onChange(value: Range): void;
  /** диапазон минимального и максимального значений */
  constraints?: Constraints;
  // todo: ограничить только положительными значениями
  /** минимальный и максимальный размер диапазона */
  sizeConstraints?: Constraints;
}

const NumbersRangeInput: React.VFC<INumbersRangeInputProps> = (props) => {
  const {
    value: range,
    constraints = Constraints.without(),
    sizeConstraints = Constraints.without(),
    onChange,
  } = props;

  const handleChangeStart = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        range
          .setStart(Number(event.target.value))
          .constrainStart(sizeConstraints)
      );
    },
    [range, sizeConstraints, onChange]
  );

  const handleChangeEnd = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        range.setEnd(Number(event.target.value)).constrainEnd(sizeConstraints)
      );
    },
    [range, sizeConstraints, onChange]
  );

  return (
    <div>
      <input
        type="number"
        onChange={handleChangeStart}
        value={range.start}
        min={constraints.min}
        max={constraints.max}
      />
      -
      <input
        type="number"
        onChange={handleChangeEnd}
        value={range.end}
        min={constraints.min}
        max={constraints.max}
      />
    </div>
  );
};

export default NumbersRangeInput;

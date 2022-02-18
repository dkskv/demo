import { is } from "ramda";
import { useCallback } from "react";
import { getDefaultBounds, IBounds, IRange } from "../utils/common";
import { getNextRange } from "./utils";

export interface INumbersRangeInputProps {
  value: IRange;
  onChange(value: IRange): void;
  bounds?: Partial<IBounds>;
  lengthBounds?: Partial<IBounds>;
}

const NumbersRangeInput: React.VFC<INumbersRangeInputProps> = (props) => {
  const {value: range, onChange } = props;
  const bounds = getDefaultBounds(props.bounds);
  const lengthBounds = getDefaultBounds(props.lengthBounds);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const key = event.target.dataset.key as keyof IRange | undefined;

      if (!is(String, key)) {
        console.error(`Incorrect input key: ${key}`);
        return;
      }

      const value = Number(event.target.value);

      onChange(getNextRange(range, [key, value], lengthBounds));
    },
    [range, onChange, lengthBounds]
  );

  const startKey: keyof IRange = "start";
  const endKey: keyof IRange = "end";

  return (
    <div>
      <input
        data-key={startKey}
        type="number"
        onChange={handleChange}
        value={range.start}
        min={bounds.min}
        max={bounds.max}
      />
      -
      <input
        data-key={endKey}
        type="number"
        onChange={handleChange}
        value={range.end}
        min={bounds.min}
        max={bounds.max}
      />
    </div>
  );
};

export default NumbersRangeInput;

import { is } from "ramda";
import { useCallback } from "react";
import { IBounds, IRange } from "../utils/common";
import { getNextRange } from "./utils";

interface IProps {
  value: IRange;
  onChange(value: IRange): void;
  bounds?: IBounds;
  lengthBounds?: IBounds;
}

const NumbersRangeInput: React.VFC<IProps> = ({
  value: range,
  onChange,
  bounds = { min: -Infinity, max: Infinity }, // rerender
  lengthBounds = { min: 0, max: Infinity }, // rerender
}) => {
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

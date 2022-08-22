import { useCallback } from "react";
import { noop } from "../../utils/common";
import { NumbersRange } from "../../utils/numbersRange";
import { Orientations } from "../../utils/orientation";
import Slider, { ISliderProps } from "../Slider";

export interface ISingleSliderProps
  extends Omit<
    ISliderProps,
    | "value"
    | "onChange"
    | "onStart"
    | "onEnd"
    | "bounds"
    | "sizeBounds"
    | "isDraggable"
  > {
  value: number;
  onChange(value: number): void;
  onStart?(value: number): void;
  onEnd?(value: number): void;
}

const SingleSlider: React.FC<ISingleSliderProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  orientation = Orientations.horizontal,
  ...rest
}) => {
  return (
    <Slider
      {...rest}
      value={new NumbersRange(0, value)}
      onChange={useSingleCallback(onChange)}
      onStart={useSingleCallback(onStart)}
      onEnd={useSingleCallback(onEnd)}
      orientation={orientation}
      thumbKeys={orientation.isReversed ? [0] : [1]}
      isDraggable={false}
    />
  );
};

function useSingleCallback(callback: (box: number) => void) {
  return useCallback(
    (range: NumbersRange) => {
      callback(range.end);
    },
    [callback]
  );
}

export default SingleSlider;

import { useCallback } from "react";
import { noop } from "../../utils/common";
import { NumbersRange } from "../../entities/numbersRange";
import { Directions } from "../../entities/direction";
import { Slider, ISliderProps } from "../Slider";

export interface ISingleSliderProps
  extends Omit<
    ISliderProps,
    | "value"
    | "onChange"
    | "onStart"
    | "onEnd"
    | "bounds"
    | "sizeLimits"
    | "isDraggable"
  > {
  value: number;
  onChange(value: number): void;
  onStart?(value: number): void;
  onEnd?(value: number): void;
}

export const SingleSlider: React.FC<ISingleSliderProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  direction = Directions.horizontal,
  ...rest
}) => {
  return (
    <Slider
      {...rest}
      value={NumbersRange.byOnlyDelta(value)}
      onChange={useSingleCallback(onChange)}
      onStart={useSingleCallback(onStart)}
      onEnd={useSingleCallback(onEnd)}
      direction={direction}
      handlesKeys={direction.isReversed ? [0] : [1]}
      isDraggable={false}
    />
  );
};

function useSingleCallback(callback: (box: number) => void) {
  return useCallback(({ end }: NumbersRange) => callback(end), [callback]);
}

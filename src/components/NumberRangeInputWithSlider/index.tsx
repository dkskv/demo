import { useMemo } from "react";
import {
  NumbersRangeInput,
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import { Slider, ISliderProps } from "../Slider";
import { createConverter } from "./utils";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import React from "react";
import { Directions } from "../../entities/direction";
import { NumbersRange } from "../../entities/numbersRange";

interface IProps
  extends Omit<INumbersRangeInputProps, "sizeLimits">,
    Omit<ISliderProps, "sizeLimits"> {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  isSmoothSlider?: boolean;
  rangeMinSize?: number;
  rangeMaxSize?: number;
}

export const NumberRangeInputWithSlider: React.FC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    isSmoothSlider = false,
    direction = Directions.horizontal,
    thickness,
    rangeMinSize,
    rangeMaxSize = Infinity,
  } = props;
  const converter = useMemo(() => createConverter(bounds), [bounds]);

  const { smoothValue, ...sliderCallbacks } = useSmoothControl({
    value,
    onChange,
    converter,
  });

  const sizeLimits = useMemo(
    () => new NumbersRange(rangeMinSize ?? -rangeMaxSize, rangeMaxSize),
    [rangeMinSize, rangeMaxSize]
  );

  return (
    <NumbersRangeInput
      value={value}
      onChange={onChange}
      bounds={bounds}
      direction={direction}
      sizeLimits={sizeLimits}
    >
      <Slider
        {...sliderCallbacks}
        value={isSmoothSlider ? smoothValue : converter.normalize(value)}
        sizeLimits={sizeLimits.map((n) => n / bounds.size)}
        direction={direction}
        thickness={thickness}
      />
    </NumbersRangeInput>
  );
};

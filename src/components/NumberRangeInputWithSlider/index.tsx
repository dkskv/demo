import { useMemo } from "react";
import {
  NumbersRangeInput,
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import { Slider, ISliderProps } from "../Slider";
import { createConverter } from "./utils";
import { NumbersRange } from "../../utils/numbersRange";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import React from "react";
import { Directions } from "../../utils/direction";

interface IProps extends INumbersRangeInputProps, ISliderProps {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  isSmoothSlider?: boolean;
}

export const NumberRangeInputWithSlider: React.FC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    sizeLimits = NumbersRange.endless(),
    isSmoothSlider = false,
    direction = Directions.horizontal,
    length,
    thickness,
  } = props;
  const converter = useMemo(() => createConverter(bounds), [bounds]);

  const { controlValue, handleControlChange, handleControlEnd } =
    useSmoothControl({
      value,
      onChange,
      converter,
      isSmooth: isSmoothSlider,
    });

  return (
    <NumbersRangeInput
      value={value}
      onChange={onChange}
      bounds={bounds}
      sizeLimits={sizeLimits}
      direction={direction}
    >
      <Slider
        value={controlValue}
        onChange={handleControlChange}
        onEnd={handleControlEnd}
        sizeLimits={sizeLimits.map((a) => a / bounds.size)}
        direction={direction}
        length={length}
        thickness={thickness}
      />
    </NumbersRangeInput>
  );
};

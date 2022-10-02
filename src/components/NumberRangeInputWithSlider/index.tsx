import { useMemo } from "react";
import {
  NumbersRangeInput,
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import { Slider, ISliderProps } from "../Slider";
import { createConverter } from "./utils";
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
    isSmoothSlider = false,
    direction = Directions.horizontal,
    length,
    thickness,
    rangeMinSize,
    rangeMaxSize,
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
      direction={direction}
      rangeMinSize={rangeMinSize}
      rangeMaxSize={rangeMaxSize}
    >
      <Slider
        value={controlValue}
        onChange={handleControlChange}
        onEnd={handleControlEnd}
        rangeMinSize={rangeMinSize && rangeMinSize / bounds.size}
        rangeMaxSize={rangeMaxSize && rangeMaxSize / bounds.size}
        direction={direction}
        length={length}
        thickness={thickness}
      />
    </NumbersRangeInput>
  );
};

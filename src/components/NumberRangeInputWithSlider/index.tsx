import { useMemo } from "react";
import makeStateful from "../../decorators/makeStateful";
import NumbersRangeInput, {
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import Slider, { ISliderProps } from "../Slider";
import { createConverter } from "./utils";
import { NumbersRange } from "../../utils/numbersRange";
import { normalize } from "../../utils/normalization";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import React from "react";
import { Directions } from "../../utils/direction";

interface IProps extends INumbersRangeInputProps, ISliderProps {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  isSmoothSlider?: boolean;
}

const NumberRangeInputWithSlider: React.FC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    sizeBounds = NumbersRange.endless(0),
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
      sizeBounds={sizeBounds}
      direction={direction}
    >
      <Slider
        value={controlValue}
        onChange={handleControlChange}
        onEnd={handleControlEnd}
        sizeBounds={normalize(sizeBounds, bounds.size)}
        direction={direction}
        length={length}
        thickness={thickness}
      />
    </NumbersRangeInput>
  );
};

export default makeStateful(NumberRangeInputWithSlider);

import { useMemo } from "react";
import makeStateful from "../../decorators/makeStateful";
import NumbersRangeInput, {
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import Slider from "../Slider";
import { createConverter } from "./utils";
import { NumbersRange } from "../../utils/numbersRange";
import { normalize } from "../../utils/normalization";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import { ReactElement } from "react";
import React from "react";

interface IProps extends INumbersRangeInputProps {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  /** Если true, слайдер движется скачками по числовым отметкам */
  isDiscreteSlider?: boolean;

  sliderWrapper: ReactElement;
}

const NumberRangeInputWithSlider: React.FC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    sizeBounds = NumbersRange.endless(0),
    isDiscreteSlider = false,
    sliderWrapper,
    children,
  } = props;
  const converter = useMemo(() => createConverter(bounds), [bounds]);

  const { controlValue, handleControlChange, handleControlEnd, handleChange } =
    useSmoothControl({
      value,
      onChange,
      converter,
      isDiscrete: isDiscreteSlider,
    });

  return (
    <NumbersRangeInput
      value={value}
      onChange={handleChange}
      bounds={bounds}
      sizeBounds={sizeBounds}
    >
      {React.cloneElement(sliderWrapper, {
        children: (
          <Slider
            value={controlValue}
            onChange={handleControlChange}
            onEnd={handleControlEnd}
            sizeBounds={normalize(sizeBounds, bounds.size)}
          >
            {children}
          </Slider>
        ),
      })}
    </NumbersRangeInput>
  );
};

export default makeStateful(NumberRangeInputWithSlider);

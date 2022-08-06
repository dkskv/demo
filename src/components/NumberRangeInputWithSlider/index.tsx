import { CSSProperties, useMemo } from "react";
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
import { getBoxStyle, stretchStyle } from "../../utils/styles";
import { Orientations } from "../../utils/orientation";
import { BoundingBox } from "../../utils/boundingBox";

interface IProps
  extends INumbersRangeInputProps,
    Omit<ISliderProps, "outerBox"> {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  isSmoothSlider?: boolean;
  sliderBox: BoundingBox;
  sliderStyle?: CSSProperties;
}

const NumberRangeInputWithSlider: React.FC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    sizeBounds = NumbersRange.endless(0),
    isSmoothSlider = false,
    sliderBox,
    sliderStyle,
    orientation = Orientations.horizontal,
    children = <div style={{ ...stretchStyle, background: "purple" }} />,
  } = props;
  const converter = useMemo(() => createConverter(bounds), [bounds]);

  const { controlValue, handleControlChange, handleControlEnd, handleChange } =
    useSmoothControl({
      value,
      onChange,
      converter,
      isSmooth: isSmoothSlider,
    });

  return (
    <NumbersRangeInput
      value={value}
      onChange={handleChange}
      bounds={bounds}
      sizeBounds={sizeBounds}
      orientation={orientation}
    >
      <div
        style={{
          background: "lavender",
          ...sliderStyle,
          ...getBoxStyle(sliderBox),
          position: "relative",
        }}
      >
        <Slider
          value={controlValue}
          onChange={handleControlChange}
          onEnd={handleControlEnd}
          sizeBounds={normalize(sizeBounds, bounds.size)}
          orientation={orientation}
          outerBox={sliderBox}
        >
          {children}
        </Slider>
      </div>
    </NumbersRangeInput>
  );
};

export default makeStateful(NumberRangeInputWithSlider);

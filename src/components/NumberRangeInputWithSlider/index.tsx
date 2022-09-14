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
import { Directions } from "../../utils/direction";
import { BoundingBox } from "../../utils/boundingBox";
import { useTheme } from "../../decorators/theme";

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
    direction = Directions.horizontal,
  } = props;
  const converter = useMemo(() => createConverter(bounds), [bounds]);

  const { controlValue, handleControlChange, handleControlEnd } =
    useSmoothControl({
      value,
      onChange,
      converter,
      isSmooth: isSmoothSlider,
    });

  const theme = useTheme();

  return (
    <NumbersRangeInput
      value={value}
      onChange={onChange}
      bounds={bounds}
      sizeBounds={sizeBounds}
      direction={direction}
    >
      <div
        style={{
          background: theme.backgroundColor,
          borderRadius: theme.smallBorderRadius,
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
          direction={direction}
          outerBox={sliderBox}
        >
          <div
            style={{
              ...stretchStyle,
              background: theme.primaryColor,
              borderRadius: theme.smallBorderRadius,
            }}
          />
        </Slider>
      </div>
    </NumbersRangeInput>
  );
};

export default makeStateful(NumberRangeInputWithSlider);

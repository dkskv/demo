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

interface IProps
  extends INumbersRangeInputProps,
    Pick<ISliderProps, "boundingBox" | "containerContent" | "trackContent"> {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  /** Если true, слайдер движется скачками по числовым отметкам */
  isDiscreteSlider?: boolean;
}

const NumberRangeInputWithSlider: React.VFC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    boundingBox,
    sizeBounds = NumbersRange.endless(0),
    isDiscreteSlider = false,
    containerContent,
    trackContent
  } = props;
  const converter = useMemo(() => createConverter(bounds), [bounds]);

  const [sliderValue, handleSliderChange, handleInputChange] = useSmoothControl(
    {
      value,
      onChange,
      converter,
      isDiscrete: isDiscreteSlider,
    }
  );

  return (
    <NumbersRangeInput
      value={value}
      onChange={handleInputChange}
      bounds={bounds}
      sizeBounds={sizeBounds}
    >
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        sizeBounds={normalize(sizeBounds, bounds.size)}
        boundingBox={boundingBox}
        containerContent={containerContent}
        trackContent={trackContent}
      />
    </NumbersRangeInput>
  );
};

export default makeStateful(NumberRangeInputWithSlider);

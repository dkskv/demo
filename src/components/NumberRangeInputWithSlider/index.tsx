import { useCallback, useMemo, useState } from "react";
import makeStateful from "../../decorators/makeStateful";
import NumbersRangeInput, {
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import Slider, { ISliderProps } from "../Slider";
import { useTwoWayBinding } from "./hooks";
import "./index.css";
import {
  getInputsRangeConverter,
  IConverter,
  identityConverter,
} from "./utils";
import { Range } from "../../utils/range";
import { normalize } from "../../utils/normalization";

interface IProps
  extends INumbersRangeInputProps,
    Pick<ISliderProps, "boundingBox"> {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  /** будет ли слайдер прерывисто двигаться по числовым отметкам */
  isDiscreteSlider?: boolean;
}

const NumberRangeInputWithSlider: React.VFC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    boundingBox,
    sizeBounds = Range.endless(0),
    isDiscreteSlider = false,
  } = props;

  const inputsRangeConverter = useMemo(
    () => getInputsRangeConverter(bounds),
    [bounds]
  );

  const [sliderValue, setSliderValue] = useState(
    inputsRangeConverter.toUni(value)
  );

  const handleUniChange = useCallback(
    (value: Range) => {
      setSliderValue(value);
      // todo: событие, даже когда числовой ввод не изменился
      onChange(inputsRangeConverter.toSrc(value));
    },
    [inputsRangeConverter, onChange]
  );

  const { values, callbacks } = useTwoWayBinding(
    isDiscreteSlider ? inputsRangeConverter.toUni(value) : sliderValue,
    handleUniChange,
    [identityConverter as IConverter<Range, Range>, inputsRangeConverter]
  );

  return (
    <div className="NumberRangeInputWithSlider">
      <Slider
        value={values[0]}
        onChange={callbacks[0]}
        sizeBounds={normalize(sizeBounds, bounds.size)}
        boundingBox={boundingBox}
      />
      <NumbersRangeInput
        value={values[1]}
        onChange={callbacks[1]}
        bounds={bounds}
        sizeBounds={sizeBounds}
      />
    </div>
  );
};

export default makeStateful(NumberRangeInputWithSlider);

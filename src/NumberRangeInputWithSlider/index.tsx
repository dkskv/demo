import { useCallback, useMemo, useState } from "react";
import makeStateful from "../decorators/makeStateful";
import NumbersRangeInput, {
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import Slider from "../Slider";
import { getDefaultBounds, IRange } from "../utils/common";
import { useTwoWayBinding } from "./hooks";
import "./index.css";
import {
  getInputsRangeConverter,
  IConverter,
  identityConverter,
  toSliderLengthBounds,
} from "./utils";

interface IProps extends INumbersRangeInputProps {
  bounds: Required<Required<INumbersRangeInputProps>["bounds"]>;
  independentSlider?: boolean;
}

const NumberRangeInputWithSlider: React.VFC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    independentSlider = true,
  } = props;

  const lengthBounds = getDefaultBounds(props.lengthBounds)

  const inputsRangeConverter = useMemo(
    () => getInputsRangeConverter(bounds),
    [bounds]
  );

  const [sliderValue, setSliderValue] = useState(
    inputsRangeConverter.toUni(value)
  );

  const handleChange = useCallback(
    (value: IRange) => {
      setSliderValue(value);
      // событие, даже когда числовой ввод не изменился
      onChange(inputsRangeConverter.toSrc(value));
    },
    [inputsRangeConverter, onChange]
  );

  const { values, callbacks } = useTwoWayBinding(
    independentSlider ? sliderValue : inputsRangeConverter.toUni(value),
    handleChange,
    [identityConverter as IConverter<IRange, IRange>, inputsRangeConverter]
  );

  return (
    <div className="NumberRangeInputWithSlider">
      <Slider
        value={values[0]}
        onChange={callbacks[0]}
        trackThickness={15}
        lengthBounds={toSliderLengthBounds(bounds, lengthBounds)}
      />
      <NumbersRangeInput
        value={values[1]}
        onChange={callbacks[1]}
        bounds={bounds}
        lengthBounds={lengthBounds}
      />
    </div>
  );
};

export default makeStateful(NumberRangeInputWithSlider);

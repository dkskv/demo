import { useCallback, useMemo, useState } from "react";
import makeStateful from "../decorators/makeStateful";
import NumbersRangeInput, {
  INumbersRangeInputProps,
} from "../NumbersRangeInput";
import Slider from "../Slider";
import { useTwoWayBinding } from "./hooks";
import "./index.css";
import {
  getInputsRangeConverter,
  IConverter,
  identityConverter,
} from "./utils";
import { Range } from "../utils/range";
import { Bounds } from "../utils/bounds";
import { normalize } from "../utils/normalization";

interface IProps extends INumbersRangeInputProps {
  bounds: NonNullable<INumbersRangeInputProps["bounds"]>;
  /** будет ли слайдер прерывисто двигаться по числовым отметкам */ 
  isDiscreteSlider?: boolean;
}

const NumberRangeInputWithSlider: React.VFC<IProps> = (props) => {
  const {
    value,
    onChange,
    bounds,
    sizeBounds = Bounds.positives(),
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
        trackThickness={15}
        sizeBounds={normalize(sizeBounds, bounds.between)}
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

import { useMemo } from "react";
import NumbersRangeInput from "../NumbersRangeInput";
import Slider from "../Slider";
import { IBounds, IRange } from "../utils/common";
import { useTwoWayBinding } from "./hooks";
import "./index.css";
import {
  getInputsRangeConverter,
  IConverter,
  identityConverter,
} from "./utils";

interface IProps {}

const initialValue: IRange = { start: 1, end: 5 };
const bounds: IBounds = { min: -10, max: 10 };
const minLength = 3;
const lengthBounds = { min: minLength, max: Infinity };

export const SliderWithInputs: React.VFC<IProps> = () => {
  const inputsRangeConverter = useMemo(
    () => getInputsRangeConverter(bounds),
    []
  );

  const { values, callbacks } = useTwoWayBinding(
    inputsRangeConverter.toUni(initialValue),
    [identityConverter as IConverter<IRange, IRange>, inputsRangeConverter]
  );

  return (
    <div className="SliderWithInputs">
      <Slider
        value={values[0]}
        onChange={callbacks[0]}
        trackThickness={15}
        // нездоровая хуйня
        // @ts-ignore
        // lengthBounds={sliderConverter.to(lengthBounds)}
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

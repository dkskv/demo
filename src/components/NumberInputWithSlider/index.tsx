import { CSSProperties, useMemo } from "react";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import { Directions } from "../../entities/direction";
import { NumbersRange } from "../../entities/numbersRange";
import { InputNumber } from "../InputNumber";
import { SingleSlider, ISingleSliderProps } from "../SingleSlider";
import { Space } from "../Space";

interface IProps extends ISingleSliderProps {
  bounds: NumbersRange;
  isSmoothSlider?: boolean;
  inputStyle?: CSSProperties;
}

export const NumberInputWithSlider: React.FC<IProps> = ({
  value,
  onChange,
  bounds,
  isSmoothSlider = false,
  direction = Directions.horizontal,
  thickness,
  inputStyle,
}) => {
  const converter = useMemo(
    () => ({
      normalize(n: number) {
        return bounds.normalizeNumber(n);
      },
      denormalize(n: number) {
        return Math.round(bounds.denormalizeNumber(n));
      },
    }),
    [bounds]
  );

  const { smoothValue, ...sliderCallbacks } = useSmoothControl({
    value,
    onChange,
    converter,
  });

  return (
    <Space size={20} direction={direction} align="center">
      <SingleSlider
        {...sliderCallbacks}
        value={isSmoothSlider ? smoothValue : converter.normalize(value)}
        direction={direction}
        thickness={thickness}
      />
      <InputNumber
        onChange={onChange}
        value={value}
        min={bounds.min}
        max={bounds.max}
        style={inputStyle}
      />
    </Space>
  );
};

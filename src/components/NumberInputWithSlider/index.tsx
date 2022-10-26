import { CSSProperties, useMemo } from "react";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import { Directions } from "../../entities/direction";
import { InputNumber } from "../InputNumber";
import { SingleSlider, ISingleSliderProps } from "../SingleSlider";
import { Space } from "../Space";

interface IProps extends ISingleSliderProps {
  max: number;
  isSmoothSlider?: boolean;
  inputStyle?: CSSProperties;
}

export const NumberInputWithSlider: React.FC<IProps> = ({
  value,
  onChange,
  max,
  isSmoothSlider = false,
  direction = Directions.horizontal,
  thickness,
  inputStyle,
}) => {
  const converter = useMemo(
    () => ({
      normalize(n: number) {
        return n / max;
      },
      denormalize(n: number) {
        return Math.round(n * max);
      },
    }),
    [max]
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
        min={0}
        max={max}
        style={inputStyle}
      />
    </Space>
  );
};

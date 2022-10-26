import { useCallback, useMemo } from "react";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import { Directions } from "../../utils/direction";
import { SingleSlider, ISingleSliderProps } from "../SingleSlider";
import { Space } from "../Space";

interface IProps extends ISingleSliderProps {
  max: number;
  isSmoothSlider?: boolean;
}

export const NumberInputWithSlider: React.FC<IProps> = ({
  value,
  onChange,
  max,
  isSmoothSlider = false,
  direction = Directions.horizontal,
  thickness,
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

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    },
    [onChange]
  );

  return (
    <Space size={20} direction={direction} align="center">
      <SingleSlider
        {...sliderCallbacks}
        value={isSmoothSlider ? smoothValue : converter.normalize(value)}
        direction={direction}
        thickness={thickness}
      />
      <input
        type="number"
        onChange={handleInputChange}
        value={value}
        min={0}
        max={max}
      />
    </Space>
  );
};

import { useCallback, useMemo } from "react";
import makeStateful from "../../decorators/makeStateful";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import SingleSlider, { ISingleSliderProps } from "../SingleSlider";
import { Space } from "../Space";

interface IProps extends ISingleSliderProps {
  max: number;
  isSmoothSlider?: boolean;
}

const NumberInputWithSlider: React.FC<IProps> = ({
  value,
  onChange,
  max,
  isSmoothSlider = false,
  direction,
  length,
  thickness,
}) => {
  const converter = useMemo(() => {
    return {
      toDestination(n: number) {
        return Math.round(n * max);
      },
      fromDestination(n: number) {
        return n / max;
      },
    };
  }, [max]);

  const { controlValue, handleControlChange, handleControlEnd } =
    useSmoothControl({
      value,
      onChange,
      converter,
      isSmooth: isSmoothSlider,
    });

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    },
    [onChange]
  );

  return (
    <Space size={20} direction={direction}>
      <SingleSlider
        value={controlValue}
        onChange={handleControlChange}
        onEnd={handleControlEnd}
        direction={direction}
        length={length}
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

export default makeStateful(NumberInputWithSlider);

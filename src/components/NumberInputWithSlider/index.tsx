import { CSSProperties, useCallback, useMemo } from "react";
import makeStateful from "../../decorators/makeStateful";
import { useSmoothControl } from "../../decorators/useSmoothControl";
import { BoundingBox } from "../../utils/boundingBox";
import { getBoxStyle, stretchStyle } from "../../utils/styles";
import SingleSlider, { ISingleSliderProps } from "../SingleSlider";
import { Space } from "../Space";

interface IProps extends Omit<ISingleSliderProps, "outerBox"> {
  max: number;
  isSmoothSlider?: boolean;
  sliderBox: BoundingBox;
  sliderStyle?: CSSProperties;
}

const NumberInputWithSlider: React.FC<IProps> = ({
  value,
  onChange,
  sliderStyle,
  sliderBox,
  max,
  isSmoothSlider = false,
  orientation,
  children = <div style={{ ...stretchStyle, background: "purple" }} />,
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

  const { controlValue, handleControlChange, handleControlEnd, handleChange } =
    useSmoothControl({
      value,
      onChange,
      converter,
      isSmooth: isSmoothSlider,
    });

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(Number(event.target.value));
    },
    [handleChange]
  );

  return (
    <Space size={20} orientation={orientation}>
      <div
        style={{
          background: "lavender",
          ...sliderStyle,
          ...getBoxStyle(sliderBox),
          position: "relative",
        }}
      >
        <SingleSlider
          value={controlValue}
          onChange={handleControlChange}
          onEnd={handleControlEnd}
          outerBox={sliderBox}
          orientation={orientation}
        >
          {children}
        </SingleSlider>
      </div>
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

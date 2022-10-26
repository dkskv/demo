import { ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Space } from "../components/Space";
import { NumbersRange } from "../entities/numbersRange";
import { Directions } from "../entities/direction";
import { Checkbox } from "../components/Checkbox";
import { NumberInputWithSlider } from "../components/NumberInputWithSlider";
import { NumberRangeInputWithSlider } from "../components/NumberRangeInputWithSlider";
import { makeStateful } from "../decorators/makeStateful";
import { stretchStyle } from "../utils/styles";

const NumberInputWithSliderStateful = makeStateful(NumberInputWithSlider);
const NumberRangeInputWithSliderStateful = makeStateful(
  NumberRangeInputWithSlider
);

export default {};

export const Sliders: ComponentStory<any> = () => {
  const [direction, setDirection] = useState(Directions.horizontal);
  const [isSmooth, setIsSmooth] = useState(true);

  const handleRotate = () => {
    setDirection((a) => a.opposite.reversed);
  };

  const commonProps = {
    thickness: 12,
    isSmoothSlider: isSmooth,
    direction,
  };

  return (
    <Space size={40} direction={Directions.vertical}>
      <Space size={20}>
        <button onClick={handleRotate}>Rotate</button>
        <Checkbox value={isSmooth} onChange={setIsSmooth} label="Smooth" />
      </Space>
      <div
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "700px",
          height: "500px",
        }}
      >
        <Space
          size={40}
          direction={direction.opposite.regular}
          style={stretchStyle}
        >
          <NumberRangeInputWithSliderStateful
            {...commonProps}
            initialValue={new NumbersRange(1, 7)}
            bounds={new NumbersRange(-10, 10)}
            rangeMinSize={0}
          />
          <NumberRangeInputWithSliderStateful
            {...commonProps}
            initialValue={new NumbersRange(1, 7)}
            bounds={new NumbersRange(-10, 10)}
            rangeMaxSize={6}
          />
          <NumberRangeInputWithSliderStateful
            {...commonProps}
            initialValue={NumbersRange.byOnlyDelta(10)}
            bounds={new NumbersRange(-30, 30)}
            rangeMinSize={5}
            rangeMaxSize={20}
          />
          <NumberInputWithSliderStateful
            {...commonProps}
            initialValue={4}
            max={10}
          />
        </Space>
      </div>
    </Space>
  );
};

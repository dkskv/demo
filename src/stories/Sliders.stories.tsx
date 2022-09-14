import { ComponentStory } from "@storybook/react";
import { useState } from "react";
import NumberRangeInputWithSlider from "../components/NumberRangeInputWithSlider";
import { Space } from "../components/Space";
import { NumbersRange } from "../utils/numbersRange";
import { Directions } from "../utils/direction";
import { Checkbox } from "../components/Checkbox";
import NumberInputWithSlider from "../components/NumberInputWithSlider";

export default { title: "Demo" };

export const Sliders: ComponentStory<typeof NumberRangeInputWithSlider> =
  () => {
    const [direction, setDirection] = useState(Directions.horizontal);
    const [isSmooth, setIsSmooth] = useState(true);

    const handleRotate = () => {
      setDirection((a) => a.opposite.reversed);
    };

    const commonProps = {
      length: 500,
      thickness: 25,
      isSmoothSlider: isSmooth,
      direction,
    };

    return (
      <Space size={40} direction={Directions.vertical}>
        <Space size={20}>
          <button onClick={handleRotate}>Rotate</button>
          <Checkbox value={isSmooth} onChange={setIsSmooth} label="Smooth" />
        </Space>
        <Space size={40} direction={direction.opposite.regular}>
          <NumberRangeInputWithSlider
            {...commonProps}
            initialValue={new NumbersRange(1, 7)}
            bounds={new NumbersRange(-10, 10)}
          />
          <NumberRangeInputWithSlider
            {...commonProps}
            initialValue={new NumbersRange(0, 10)}
            bounds={new NumbersRange(-30, 30)}
            sizeBounds={new NumbersRange(10, 30)}
          />
          <NumberInputWithSlider {...commonProps} initialValue={4} max={10} />
        </Space>
      </Space>
    );
  };

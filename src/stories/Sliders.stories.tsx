import { ComponentStory } from "@storybook/react";
import { useState } from "react";
import NumberRangeInputWithSlider from "../components/NumberRangeInputWithSlider";
import { Space } from "../components/Space";
import { NumbersRange } from "../utils/numbersRange";
import { Orientations } from "../utils/orientation";
import { prop } from "ramda";

export default { title: "Demo" };

export const Sliders: ComponentStory<typeof NumberRangeInputWithSlider> =
  () => {
    const [orientation, setOrientation] = useState(Orientations.vertical);
    const [smooth, setSmooth] = useState(false);

    const handleRotate = () => {
      setOrientation(prop("opposite"));
    };

    const sliderBox = orientation.boxFromRanges(
      new NumbersRange(0, 500),
      new NumbersRange(0, 25)
    );

    const commonProps = { sliderBox, isSmoothSlider: smooth, orientation };

    return (
      <Space size={40} orientation={Orientations.vertical}>
        <Space size={20}>
          <button onClick={handleRotate}>Rotate</button>
          <span>
            <input
              type="checkbox"
              onChange={({ target: { checked } }) => {
                setSmooth(checked);
              }}
            />
            Smooth
          </span>
        </Space>
        <Space size={40} orientation={orientation.opposite}>
          <NumberRangeInputWithSlider
            {...commonProps}
            initialValue={new NumbersRange(1, 7)}
            bounds={new NumbersRange(-10, 10)}
          />
          <NumberRangeInputWithSlider
            {...commonProps}
            initialValue={new NumbersRange(1, 7)}
            bounds={new NumbersRange(-10, 10)}
          />
          <NumberRangeInputWithSlider
            {...commonProps}
            initialValue={new NumbersRange(1, 7)}
            bounds={new NumbersRange(-10, 10)}
          />
        </Space>
      </Space>
    );
  };

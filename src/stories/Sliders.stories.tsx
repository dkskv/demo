import { ComponentStory } from "@storybook/react";
import { useState } from "react";
import NumberRangeInputWithSlider from "../components/NumberRangeInputWithSlider";
import { NumbersRange } from "../utils/numbersRange";
import { Orientations } from "../utils/orientation";

export default { title: "Demo" };

export const Sliders: ComponentStory<typeof NumberRangeInputWithSlider> =
  () => {
    const [orientation, setOrientation] = useState(Orientations.vertical);

    const [smooth, setSmooth] = useState(false);

    const handleRotate = () => {
      setOrientation((prev) =>
        prev === Orientations.horizontal
          ? Orientations.vertical
          : Orientations.horizontal
      );
    };

    const sliderBox = orientation.boxFromRanges(
      new NumbersRange(0, 500),
      new NumbersRange(0, 25)
    );

    const commonProps = { sliderBox, isSmoothSlider: smooth, orientation };

    return (
      <div style={{ display: "flex", rowGap: "40px", flexDirection: "column" }}>
        <div style={{ display: "flex", columnGap: "20px" }}>
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
        </div>
        <div
          style={{
            display: "flex",
            [orientation === Orientations.horizontal ? "rowGap" : "columnGap"]:
              "40px",
            flexDirection:
              orientation === Orientations.horizontal ? "column" : "row",
          }}
        >
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
        </div>
      </div>
    );
  };

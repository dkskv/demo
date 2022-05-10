import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useCallback, useState } from "react";
import { useDragMovement } from "../components/Draggable/hooks";
import { VirtualView } from "../components/VirtualView";
import { useCallbackRef } from "../hooks";
import { BoundingBox } from "../utils/boundingBox";
import { NumbersRange } from "../utils/numbersRange";
import { Point } from "../utils/point";
import {
  centererStyle,
  ellipsisStyle,
  getRgbaColor,
  stretchStyle,
} from "../utils/styles";
import Slider from "../components/Slider";

export default {
  title: "Demo/Carousel",
  component: VirtualView,
  parameters: {},
} as ComponentMeta<typeof VirtualView>;

const viewBox = BoundingBox.createByDimensions(0, 0, 500, 70);

const Template: ComponentStory<typeof VirtualView> = (args) => {
  // const [boundsRange, setBoundsRange] = useState<NumbersRange>();
  const [sliderValue, setSliderValue] = useState<NumbersRange>(
    new NumbersRange(0, 0.3)
  );
  const [element, setElement] = useCallbackRef();

  const viewSize = viewBox.dx;
  const totalSize = viewSize / sliderValue.size;

  const handleDrag = useCallback(
    (delta: Point) => {
      setSliderValue((prevValue) => {
        const bounds = new NumbersRange(0, 1);
        return bounds.clampInner(prevValue.shift(-delta.x / totalSize));
      });
    },
    [totalSize]
  );

  useDragMovement({ element, onChange: handleDrag });

  return (
    <>
      <div
        ref={setElement}
        style={{
          display: "inline-block",
          background: "orange",
          userSelect: "none",
          cursor: "grab",
        }}
      >
        <VirtualView
          viewBox={viewBox}
          coordinate={sliderValue.start * totalSize}
          itemSize={totalSize / DataRenderer.itemsSize}
          renderItem={DataRenderer.renderItem}
        />
      </div>
      <Slider
        value={sliderValue}
        onChange={setSliderValue}
        boundingBox={viewBox}
        sizeBounds={new NumbersRange(0.2, 1)}
        trackContent={
          <div
            style={{
              ...stretchStyle,
              background: getRgbaColor("#FFFFFF", 0.3),
              border: "1px solid orange",
            }}
          />
        }
      >
        <VirtualView
          viewBox={viewBox}
          coordinate={0}
          itemSize={viewSize / DataRenderer.itemsSize}
          renderItem={DataRenderer.renderItem}
        />
      </Slider>
    </>
  );
};

export const WithButtons = Template.bind({});

class DataRenderer {
  private static items = [
    "lavender",
    "thistle",
    "plum",
    "violet",
    "orchid",
    "fuchsia",
    "magenta",
    "mediumOrchid",
    "mediumPurple",
    "blueViolet",
    "darkViolet",
    "darkOrchid",
    "darkMagenta",
    "purple",
    "indigo",
    "slateBlue",
    "darkSlateBlue",
  ];

  static itemsSize = this.items.length;

  static renderItem = (index: number) => {
    const color = this.items[index];

    return (
      <div
        style={{ ...stretchStyle, padding: `${8}px`, boxSizing: "border-box" }}
      >
        <div
          style={{
            ...centererStyle,
            ...stretchStyle,
            padding: `${8}px`,
            boxSizing: "border-box",
            backgroundColor: color,
          }}
        >
          <div style={ellipsisStyle}>{color}</div>
        </div>
      </div>
    );
  }
}
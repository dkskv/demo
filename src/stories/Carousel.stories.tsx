import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useCallback, useState } from "react";
import { useDragMovement } from "../components/Draggable/hooks";
import { VirtualView } from "../components/VirtualView";
import { useCallbackRef } from "../hooks";
import { BoundingBox } from "../utils/boundingBox";
import { NumbersRange } from "../utils/numbersRange";
import { Point } from "../utils/point";
import { centererStyle, stretchStyle } from "../utils/styles";

export default {
  title: "Demo/Carousel",
  component: VirtualView,
  parameters: {},
} as ComponentMeta<typeof VirtualView>;

const data = [
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

const viewBox = BoundingBox.createByDimensions(0, 0, 500, 50);

const Template: ComponentStory<typeof VirtualView> = (args) => {
  const [boundsRange, setBoundsRange] = useState<NumbersRange>();
  const [coordinate, setCoordinate] = useState(0);
  const [element, setElement] = useCallbackRef();

  const renderItem = useCallback((index: number) => {
    const color = data[index];

    return (
      <div
        style={{ ...stretchStyle, ...centererStyle, backgroundColor: color }}
      >
        {color}
      </div>
    );
  }, []);

  const handleDrag = useCallback(
    (delta: Point) => {
      setCoordinate((prevCoordinate) => {
        const nextCoordinate = prevCoordinate - delta.x;
        return boundsRange!.clampNumber(nextCoordinate);
      });
    },
    [boundsRange]
  );

  useDragMovement({ element, onChange: handleDrag });

  return (
    <div
      ref={setElement}
      style={{
        display: "inline-block",
        padding: "10px",
        background: "orange",
        userSelect: "none",
        cursor: "grab"
      }}
    >
      <VirtualView
        viewBox={viewBox}
        itemSize={120}
        gutter={14}
        coordinate={coordinate}
        count={data.length}
        renderItem={renderItem}
        onBoundsChange={setBoundsRange}
      />
    </div>
  );
};

export const WithButtons = Template.bind({});

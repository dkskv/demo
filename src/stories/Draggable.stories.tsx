import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useCallback, useState } from "react";
import { StatefulDraggable } from "../components/Draggable";
import { Point } from "../utils/point";
import { centererStyle } from "../utils/styles";

export default {
  title: "Demo/Draggable",
  component: StatefulDraggable,
  parameters: {},
} as ComponentMeta<typeof StatefulDraggable>;

const Template: ComponentStory<typeof StatefulDraggable> = (args) => {
  const [isDragging, setDragging] = useState(false);

  const handleStart = useCallback(() => setDragging(true), []);
  const handleEnd = useCallback(() => setDragging(false), []);

  return (
    <StatefulDraggable {...args} onStart={handleStart} onEnd={handleEnd}>
      <div
        style={{
          ...centererStyle,
          width: "100px",
          height: "60px",
          background: "purple",
          color: "white",
          cursor: "pointer",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        Drag me
      </div>
    </StatefulDraggable>
  );
};

export const Simple = Template.bind({});
Simple.args = {
  initialValue: new Point(20, 20),
};

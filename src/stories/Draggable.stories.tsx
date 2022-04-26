import { ComponentStory, ComponentMeta } from "@storybook/react";
import { StatefulDraggable } from "../components/Draggable";
import { Point } from "../utils/point";
import { centererStyle } from "../utils/styles";

export default {
  title: "Demo/Draggable",
  component: StatefulDraggable,
  parameters: {},
} as ComponentMeta<typeof StatefulDraggable>;

const Template: ComponentStory<typeof StatefulDraggable> = (args) => (
  <StatefulDraggable {...args} />
);

export const Simple = Template.bind({});
Simple.args = {
  initialValue: new Point(20, 20),
  children: (
    <div
      style={{
        ...centererStyle,
        width: "100px",
        height: "60px",
        background: "purple",
        color: "white",
        cursor: "pointer"
      }}
    >
      Drag me
    </div>
  ),
};

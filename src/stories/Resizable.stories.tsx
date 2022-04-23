import { ComponentStory, ComponentMeta } from "@storybook/react";
import Resizable from "../components/Resizable";
import { BoundingBox } from "../utils/boundingBox";
import { BoxSizesBounds } from "../utils/boxSizesBounds";

export default {
  title: "Demo/Resizable",
  component: Resizable,
  parameters: {},
} as ComponentMeta<typeof Resizable>;

const Template: ComponentStory<typeof Resizable> = (args) => (
    <Resizable {...args} />
);

export const Simple = Template.bind({});
Simple.args = {
  initialValue: BoundingBox.createByDimensions(50, 60, 200, 150),
  sizesBounds: new BoxSizesBounds(100, 600, 80, 400),
  children: (
    <span
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "purple",
        color: "white",
        cursor: "pointer"
      }}
    >
      Resize me
    </span>
  ),
};

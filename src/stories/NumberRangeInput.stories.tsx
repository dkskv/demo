import { ComponentMeta, ComponentStory } from "@storybook/react";
import NumberRangeInputWithSlider from "../components/NumberRangeInputWithSlider";
import { BoundingBox } from "../utils/boundingBox";
import { NumbersRange } from "../utils/numbersRange";
import { stretchStyle } from "../utils/styles";

export default {
  title: "Demo/NumberRangeInput",
  component: NumberRangeInputWithSlider,
  parameters: {},
} as ComponentMeta<typeof NumberRangeInputWithSlider>;

const Template: ComponentStory<typeof NumberRangeInputWithSlider> = (args) => (
  <NumberRangeInputWithSlider {...args} />
);

export const WithSlider = Template.bind({});
WithSlider.args = {
  initialValue: new NumbersRange(1, 7),
  bounds: new NumbersRange(-10, 10),
  boundingBox: BoundingBox.createByDimensions(0, 0, 500, 25),
  trackContent: <div style={{ ...stretchStyle, background: "purple" }} />,
  children: <div style={{ ...stretchStyle, background: "lavender" }} />,
};

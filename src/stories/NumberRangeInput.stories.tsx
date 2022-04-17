import { ComponentMeta, ComponentStory } from "@storybook/react";
import NumberRangeInputWithSlider from "../components/NumberRangeInputWithSlider";
import { BoundingBox } from "../utils/boundingBox";
import { Range } from "../utils/range";

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
  initialValue: new Range(1, 7),
  bounds: new Range(-10, 10),
  boundingBox: BoundingBox.createByDimensions(0, 0, 500, 25),
};

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { VirtualViewWithButtons } from "../components/VirtualViewWithButtons";

export default {
  title: "Demo/VirtualView",
  component: VirtualViewWithButtons,
  parameters: {},
} as ComponentMeta<typeof VirtualViewWithButtons>;

const Template: ComponentStory<typeof VirtualViewWithButtons> = (args) => (
  <VirtualViewWithButtons {...args} />
);

export const WithButtons = Template.bind({});

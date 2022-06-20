import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SortableContainer } from "../components/SortableContainer";
import { BoundingBox } from "../utils/boundingBox";
import { ISortableItem, positionInChain } from "../utils/sortable/sortable";
import { stretchStyle } from "../utils/styles";

export default {
  title: "Demo/Sortable",
  parameters: {},
} as ComponentMeta<any>;

const width = 200;

const sizes = [50, 150, 150, 150];
const colors = ["red", "blue", "green", "purple"];
const items: ISortableItem[] = positionInChain(
  colors.map((color, index) => {
    const height: number = sizes[index];

    return {
      key: color,
      box: BoundingBox.createByDimensions(0, 0, 200, height),
    };
  })
);

export const Only: ComponentStory<any> = () => {
  return (
    <SortableContainer
      items={items}
      transitionDuration={300}
      box={BoundingBox.createByDimensions(0, 0, width, 600)}
      style={{ background: "grey" }}
    >
      {({ key }) => (
        <div style={{ ...stretchStyle, background: key, cursor: "pointer" }} />
      )}
    </SortableContainer>
  );
};

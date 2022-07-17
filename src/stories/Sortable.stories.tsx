import { ComponentStory, ComponentMeta } from "@storybook/react";
import { zipWith } from "ramda";
import { DroppableContainer } from "../components/DroppableContainer";
import { SortableContainer } from "../components/SortableContainer";
import { DndConnector } from "../decorators/dndConnection";
import { BoundingBox } from "../utils/boundingBox";
import { ISortableItem, positionInChain } from "../utils/sortable/sortable";
import { stretchStyle } from "../utils/styles";

export default {
  title: "Demo/Sortable",
  parameters: {},
} as ComponentMeta<any>;

const width = 200;

const getItems = (colors: string[], sizes: number[]) =>
  positionInChain(
    zipWith(
      (color, height) => {
        return {
          key: color,
          box: BoundingBox.createByDimensions(0, 0, 200, height),
        };
      },
      colors,
      sizes
    )
  );

function renderer({ key }: ISortableItem) {
  return (
    <div style={{ ...stretchStyle, background: key, cursor: "pointer" }} />
  );
}

export const Only: ComponentStory<any> = () => {
  const items = getItems(
    ["red", "blue", "green", "purple"],
    [50, 150, 150, 150]
  );

  return (
    <SortableContainer
      items={items}
      transitionDuration={300}
      box={BoundingBox.createByDimensions(0, 0, width, 600)}
      style={{ background: "grey" }}
    >
      {renderer}
    </SortableContainer>
  );
};

const initialItems1 = {
  test_1: BoundingBox.square(0, 0, 50),
  test_2: BoundingBox.square(0, 300, 50),
};

const initialItems2 = {
  test_3: BoundingBox.square(0, 0, 50),
  test_4: BoundingBox.square(0, 300, 50),
};

export const Double2: ComponentStory<any> = () => {
  return (
    <div style={{ display: "flex", columnGap: 300, position: "relative" }}>
      <DndConnector>
        <DroppableContainer id="first" initialItems={initialItems1} />
        <DroppableContainer id="second" initialItems={initialItems2} />
      </DndConnector>
    </div>
  );
};

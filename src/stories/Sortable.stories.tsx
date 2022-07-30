import { ComponentStory, ComponentMeta } from "@storybook/react";
import { zipWith } from "ramda";
import { ConnectedSortableContainer } from "../components/ConnectedSortableContainer";
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

export const Double3: ComponentStory<any> = () => {
  const items = getItems(
    ["red", "blue", "green", "purple"],
    [50, 150, 150, 150]
  );

  const items2 = getItems(
    ["orange", "black", "yellow", "deepskyblue"],
    [50, 150, 150, 150]
  );

  return (
    <div style={{ display: "flex", columnGap: 300, position: "relative" }}>
      <DndConnector>
        <ConnectedSortableContainer
          id="first"
          items={items}
          transitionDuration={300}
          box={BoundingBox.createByDimensions(0, 0, width, 600)}
          style={{ background: "grey" }}
        >
          {renderer}
        </ConnectedSortableContainer>
        <ConnectedSortableContainer
          id="second"
          items={items2}
          transitionDuration={300}
          box={BoundingBox.createByDimensions(0, 0, width, 600)}
          style={{ background: "grey" }}
        >
          {renderer}
        </ConnectedSortableContainer>
      </DndConnector>
    </div>
  );
};

import { ComponentStory } from "@storybook/react";
import { zipWith } from "ramda";
import { SortableContainer } from "../components/SortableContainer";
import { DndConnector } from "../decorators/dndConnection";
import { BoundingBox } from "../utils/boundingBox";
import { ISortableItem, positionInChain } from "../utils/sortable/sortable";
import { stretchStyle } from "../utils/styles";

export default { title: "Demo" };

const width = 200;

const generateItems = (colors: string[], sizes: number[]) =>
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

function renderItem({ key }: ISortableItem) {
  return (
    <div
      style={{
        ...stretchStyle,
        background: key,
        cursor: "pointer",
        opacity: 0.5,
      }}
    />
  );
}

export const SortableContainers: ComponentStory<any> = () => {
  const items = generateItems(
    ["red", "blue", "green", "purple"],
    [50, 100, 100, 150]
  );

  const items2 = generateItems(
    ["orange", "black", "yellow", "deepskyblue"],
    [50, 100, 100, 150]
  );

  return (
    <div style={{ display: "flex", columnGap: 300, position: "relative" }}>
      <DndConnector>
        <SortableContainer
          id="first"
          items={items}
          transitionDuration={300}
          box={BoundingBox.createByDimensions(0, 0, width, 600)}
          style={{ background: "grey" }}
        >
          {renderItem}
        </SortableContainer>
        <SortableContainer
          id="second"
          items={items2}
          transitionDuration={300}
          box={BoundingBox.createByDimensions(0, 0, width, 600)}
          style={{ background: "grey" }}
        >
          {renderItem}
        </SortableContainer>
      </DndConnector>
    </div>
  );
};

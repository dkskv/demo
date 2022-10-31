import { ComponentStory } from "@storybook/react";
import { zipWith } from "ramda";
import { SortableContainer } from "../components/SortableContainer";
import {
  ISortableItem,
  positionInChain,
} from "../components/SortableContainer/utils/sortable";
import { DndConnector } from "../decorators/dndConnection/dndConnector";
import { useTheme } from "../decorators/theme";
import { BoundingBox } from "../entities/boundingBox";
import { stretchStyle } from "../utils/styles";

export default {};

const width = 200;

const generateItems = (colors: string[], sizes: number[]) =>
  positionInChain(
    zipWith(
      (color, height) => {
        return {
          key: color,
          box: BoundingBox.byDeltas(0, 0, 200, height),
        };
      },
      colors,
      sizes
    )
  );

export const SortableCards: ComponentStory<any> = () => {
  const theme = useTheme();

  const items = generateItems(
    ["red", "blue", "green", "purple"],
    [50, 100, 100, 150]
  );

  const items2 = generateItems(
    ["orange", "black", "yellow", "deepskyblue"],
    [50, 100, 100, 150]
  );

  function renderItem({ key }: ISortableItem) {
    return (
      <div
        style={{
          ...stretchStyle,
          background: key,
          borderRadius: theme.largeBorderRadius,
          opacity: 0.5,
        }}
      />
    );
  }

  const containerStyle = {
    background: theme.backgroundColor,
    flexShrink: 0,
    borderRadius: theme.largeBorderRadius,
  };

  const mockWrapperStyle = {
    padding: "10px",
    border: `1px solid ${theme.strokeColor}`,
    borderRadius: theme.largeBorderRadius,
  };

  return (
    <div style={{ display: "flex", columnGap: 280, position: "relative" }}>
      <DndConnector>
        <SortableContainer
          id="first"
          items={items}
          transitionDuration={300}
          box={BoundingBox.byDeltas(0, 0, width, 600)}
          style={containerStyle}
          renderItem={renderItem}
        />
        <SortableContainer
          id="second"
          items={items2}
          transitionDuration={300}
          box={BoundingBox.byDeltas(0, 0, width, 600)}
          style={containerStyle}
          renderItem={renderItem}
        />
        <div style={mockWrapperStyle}>
          Nesting
          <div style={mockWrapperStyle}>
            Nesting
            <SortableContainer
              id="third"
              items={[]}
              transitionDuration={300}
              box={BoundingBox.byDeltas(0, 0, width, 600)}
              style={containerStyle}
              renderItem={renderItem}
            />
          </div>
        </div>
      </DndConnector>
    </div>
  );
};

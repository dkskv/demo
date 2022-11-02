import { ComponentStory } from "@storybook/react";
import { zipWith } from "ramda";
import { useState } from "react";
import { NumberInputWithSlider } from "../components/NumberInputWithSlider";
import { SortableContainer } from "../components/SortableContainer";
import {
  ISortableItem,
  positionInChain,
} from "../components/SortableContainer/utils/sortable";
import { Space } from "../components/Space";
import { DndConnector } from "../decorators/dndConnection/dndConnector";
import { useTheme } from "../decorators/theme";
import { BoundingBox } from "../entities/boundingBox";
import { Directions } from "../entities/direction";
import { NumbersRange } from "../entities/numbersRange";
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
  const [transitionDuration, setTransitionDuration] = useState(300);

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
          opacity: 0.7,
        }}
      />
    );
  }

  const containerStyle = {
    background: theme.backgroundColor,
    flexShrink: 0,
    borderRadius: theme.largeBorderRadius,
  };

  return (
    <Space size={50} direction={Directions.vertical}>
      <Space size={4} direction={Directions.vertical} style={{ width: 400 }}>
        Duration, ms
        <NumberInputWithSlider
          value={transitionDuration}
          onChange={setTransitionDuration}
          thickness={10}
          bounds={new NumbersRange(100, 2000)}
        />
      </Space>
      <Space size={350} style={{ position: "relative" }}>
        <DndConnector>
          <SortableContainer
            id="first"
            items={items}
            transitionDuration={transitionDuration}
            box={BoundingBox.byDeltas(0, 0, width, 600)}
            style={containerStyle}
            renderItem={renderItem}
          />
          <SortableContainer
            id="second"
            items={items2}
            transitionDuration={transitionDuration}
            box={BoundingBox.byDeltas(0, 0, width, 600)}
            style={containerStyle}
            renderItem={renderItem}
          />
        </DndConnector>
      </Space>
    </Space>
  );
};

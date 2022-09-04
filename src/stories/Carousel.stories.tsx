import { ComponentMeta, ComponentStory } from "@storybook/react";
import { VirtualList } from "../components/VirtualList";
import { BoundingBox } from "../utils/boundingBox";
import { times } from "ramda";
import { SwipeContainer } from "../components/SwipeContainer";
import { Space } from "../components/Space";
import { Directions } from "../utils/direction";
import { centererStyle, getBoxStyle } from "../utils/styles";

export default {
  title: "Demo",
  parameters: {},
} as ComponentMeta<any>;

export const SwipeContainerStory: ComponentStory<typeof VirtualList> = () => {
  const viewBox = BoundingBox.createByDimensions(0, 0, 500, 70);
  const itemBox = BoundingBox.createByDimensions(0, 0, 100, 70);

  return (
    <SwipeContainer box={viewBox}>
      <Space size={5} direction={Directions.horizontal}>
        {times(
          (i: number) => (
            <div
              style={{
                ...getBoxStyle(itemBox),
                ...centererStyle,
                background: "lightgrey",
              }}
            >
              {i}
            </div>
          ),
          20
        )}
      </Space>
    </SwipeContainer>
  );
};

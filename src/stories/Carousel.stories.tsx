import { ComponentMeta, ComponentStory } from "@storybook/react";
import { times } from "ramda";
import { SwipeContainer } from "../components/SwipeContainer";
import { Space } from "../components/Space";
import { Directions } from "../utils/direction";
import { centererStyle, getBoxStyle } from "../utils/styles";
import { useCallback, useState } from "react";
import { NumbersRange } from "../utils/numbersRange";

export default {
  title: "Demo",
  parameters: {},
} as ComponentMeta<any>;

export const SwipeContainerStory: ComponentStory<any> = () => {
  const [direction, setDirection] = useState(Directions.horizontal);

  const handleRotate = useCallback(() => {
    setDirection((prevDir) => prevDir.opposite);
  }, []);

  const viewBox = direction.boxFromRanges(
    new NumbersRange(0, 500),
    new NumbersRange(0, 70)
  );
  const itemBox = direction.boxFromRanges(
    new NumbersRange(0, 100),
    new NumbersRange(0, 70)
  );

  return (
    <Space direction={Directions.vertical} size={20}>
      <div>
        <button onClick={handleRotate}>Rotate</button>
      </div>
      <SwipeContainer box={viewBox} direction={direction}>
        <Space size={5} direction={direction}>
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
    </Space>
  );
};

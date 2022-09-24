import { ComponentStory } from "@storybook/react";
import { times } from "ramda";
import { SwipeContainer } from "../components/SwipeContainer";
import { Space } from "../components/Space";
import { Directions } from "../utils/direction";
import { centererStyle, getBoxStyle } from "../utils/styles";
import { useCallback, useState } from "react";
import { NumbersRange } from "../utils/numbersRange";
import { BoundingBox } from "../utils/boundingBox";
import { useTheme } from "../decorators/theme";

export default { title: "Demo" };

export const SwipeContainerStory: ComponentStory<any> = () => {
  const [direction, setDirection] = useState(Directions.horizontal);

  const handleRotate = useCallback(() => {
    setDirection((prevDir) => prevDir.opposite);
  }, []);

  const thickness = 200;

  const viewBox = direction.boxFromRanges(
    new NumbersRange(0, 800),
    new NumbersRange(0, thickness)
  );

  const oddItemBox = BoundingBox.square(0, 0, thickness);

  const evenItemBox = direction.boxFromRanges(
    new NumbersRange(0, thickness * 2),
    new NumbersRange(0, thickness)
  );

  const theme = useTheme();

  return (
    <Space direction={Directions.vertical} size={20}>
      <div>
        <button onClick={handleRotate}>Rotate</button>
      </div>
      <SwipeContainer box={viewBox} direction={direction}>
        <Space size={theme.smallIndent} direction={direction}>
          {times(
            (i: number) => (
              <div
                key={i}
                style={{
                  ...getBoxStyle(i % 2 === 0 ? evenItemBox : oddItemBox),
                  ...centererStyle,
                  background: theme.primaryColor,
                  color: theme.textColor,
                  borderRadius: theme.largeBorderRadius,
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

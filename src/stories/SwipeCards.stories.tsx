import { ComponentStory } from "@storybook/react";
import { times } from "ramda";
import { SwipeContainer } from "../components/SwipeContainer";
import { Space } from "../components/Space";
import { Directions } from "../entities/direction";
import { centererStyle, getBoxStyle } from "../utils/styles";
import { useCallback, useState } from "react";
import { NumbersRange } from "../entities/numbersRange";
import { BoundingBox } from "../entities/boundingBox";
import { useTheme } from "../decorators/theme";

export default {};

export const SwipeCards: ComponentStory<any> = () => {
  const [direction, setDirection] = useState(Directions.horizontal);

  const handleRotate = useCallback(() => {
    setDirection((prevDir) => prevDir.opposite);
  }, []);

  const thickness = 200;

  const viewBox = direction.boxFromRanges(
    NumbersRange.byOnlyDelta(800),
    NumbersRange.byOnlyDelta(thickness)
  );

  const oddItemBox = BoundingBox.square(0, 0, thickness);

  const evenItemBox = direction.boxFromRanges(
    NumbersRange.byOnlyDelta(thickness * 2),
    NumbersRange.byOnlyDelta(thickness)
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

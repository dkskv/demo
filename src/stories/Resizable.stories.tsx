import { ComponentStory } from "@storybook/react";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "../components/Checkbox";
import { Grid } from "../components/Grid";
import { Resizable } from "../components/Resizable";
import { Space } from "../components/Space";
import { BoundingBox } from "../utils/boundingBox";
import { magnetize } from "../utils/common";
import { NumbersRange } from "../utils/numbersRange";
import { Directions } from "../utils/direction";
import { getBoxStyle, stretchStyle } from "../utils/styles";
import { SizeLimits } from "../utils/sizeLimits";
import { useTheme } from "../decorators/theme";

export default { title: "Demo" };

export const ResizableBox: ComponentStory<typeof Resizable> = () => {
  const gridStep = 20;
  const gridLargeStep = 20 * 4;

  const [isGridEnabled, setIsGridEnabled] = useState(false);
  const [isLockedRatio, setIsLockedRatio] = useState(false);

  const outerBox = BoundingBox.createByDimensions(0, 0, 800, 600).map(
    magnetize(gridLargeStep)
  );
  const [value, setValue] = useState(() =>
    BoundingBox.createByDimensions(50, 60, 200, 150)
  );

  function magnetizeBox(b: BoundingBox) {
    return b.map(magnetize(gridStep));
  }

  useEffect(() => {
    if (isGridEnabled) {
      setValue(magnetizeBox);
    }
  }, [isGridEnabled]);

  const handleEnd = useCallback(() => {
    if (isGridEnabled) {
      setValue(magnetizeBox);
    }
  }, [isGridEnabled]);

  const grid = [
    [gridStep, 1],
    [gridLargeStep, 2],
  ].map(([step, thickness]) => (
    <Grid
      key={step}
      id={String(step)}
      step={step}
      thickness={thickness}
      color="rgba(0, 0, 0, 0.5)"
    />
  ));

  const theme = useTheme();

  return (
    <Space size={40} direction={Directions.vertical}>
      <Space size={20}>
        <Checkbox
          value={isGridEnabled}
          onChange={setIsGridEnabled}
          label="Enable grid"
        />
        <Checkbox
          value={isLockedRatio}
          onChange={setIsLockedRatio}
          label="Lock ratio"
        />
      </Space>
      <div
        style={{
          position: "relative",
          border: "1px solid black",
          ...getBoxStyle(outerBox),
        }}
      >
        {isGridEnabled && grid}
        <Resizable
          value={value}
          sizeLimits={
            new SizeLimits(
              new NumbersRange(100, 600),
              new NumbersRange(80, 400)
            )
          }
          onEnd={handleEnd}
          // todo: устранить необходимость вызывать `resetOrigin`
          outerBox={outerBox.resetOrigin()}
          onChange={setValue}
          keepAspectRatio={isLockedRatio}
        >
          <div
            style={{
              ...stretchStyle,
              background: theme.primaryColor,
              borderRadius: theme.largeBorderRadius,
            }}
          />
        </Resizable>
      </div>
    </Space>
  );
};

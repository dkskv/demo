import { ComponentStory } from "@storybook/react";
import { useCallback, useEffect, useState } from "react";
import { Grid } from "../components/Grid";
import Resizable from "../components/Resizable";
import { Space } from "../components/Space";
import { BoundingBox } from "../utils/boundingBox";
import { magnetize } from "../utils/common";
import { NumbersRange } from "../utils/numbersRange";
import { Orientations } from "../utils/orientation";
import { centererStyle, getBoxStyle, stretchStyle } from "../utils/styles";

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

  return (
    <Space size={40} orientation={Orientations.vertical}>
      <Space size={20}>
        <span>
          <input
            type="checkbox"
            onChange={({ target: { checked } }) => {
              setIsGridEnabled(checked);
            }}
          />
          Grid
        </span>
        <span>
          <input
            type="checkbox"
            onChange={({ target: { checked } }) => {
              setIsLockedRatio(checked);
            }}
          />
          Lock ratio
        </span>
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
          sizeBounds={{
            width: new NumbersRange(100, 600),
            height: new NumbersRange(80, 400),
          }}
          onEnd={handleEnd}
          // todo: устранить необходимость вызывать `resetOrigin`
          outerBox={outerBox.resetOrigin()}
          onChange={setValue}
          keepAspectRatio={isLockedRatio}
        >
          <span
            style={{
              ...stretchStyle,
              ...centererStyle,
              background: "purple",
              color: "white",
              cursor: "pointer",
            }}
          >
            Resize me
          </span>
        </Resizable>
      </div>
    </Space>
  );
};

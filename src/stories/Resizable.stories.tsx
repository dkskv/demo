import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useCallback, useState } from "react";
import { Grid } from "../components/Grid";
import Resizable from "../components/Resizable";
import { BoundingBox } from "../utils/boundingBox";
import { NumbersRange } from "../utils/numbersRange";
import { centererStyle, getBoxStyle, stretchStyle } from "../utils/styles";

export default {
  title: "Demo/Resizable",
  component: Resizable,
  parameters: {},
} as ComponentMeta<typeof Resizable>;

const child = (
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
);

const initialValue = BoundingBox.createByDimensions(50, 60, 200, 150);
const sizeBounds = {
  width: new NumbersRange(100, 600),
  height: new NumbersRange(80, 400),
};

const commonProps = {
  sizeBounds,
  children: child,
};

export const Simple: ComponentStory<typeof Resizable> = () => (
  <Resizable {...commonProps} initialValue={initialValue} />
);

export const GridGlue: ComponentStory<typeof Resizable> = () => {
  const mainStep = 20;

  function magnetize(n: number) {
    return Math.round(n / mainStep) * mainStep;
  }

  const [value, setValue] = useState(initialValue.map(magnetize));

  const handleEnd = useCallback(() => {
    setValue((box: BoundingBox) => box.map(magnetize));
  }, []);

  const grid = [
    [mainStep, 1],
    [mainStep * 4, 2],
  ].map(([step, thickness], index) => (
    <div
      key={index}
      style={{
        position: "absolute",
        opacity: 0.5,
        ...getBoxStyle(
          BoundingBox.createByDimensions(
            -thickness / 2,
            -thickness / 2,
            700,
            450
          )
        ),
      }}
    >
      <Grid
        id={String(index)}
        step={step}
        thickness={thickness}
        color="lightgrey"
      />
    </div>
  ));

  return (
    <>
      {grid}
      <Resizable
        {...commonProps}
        value={value}
        onChange={setValue}
        onEnd={handleEnd}
      />
    </>
  );
};

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useCallback, useMemo, useState } from "react";
import { useDragMovement } from "../components/Draggable/hooks";
import { VirtualList } from "../components/VirtualList";
import { useCallbackRef } from "../hooks";
import { BoundingBox } from "../utils/boundingBox";
import { NumbersRange } from "../utils/numbersRange";
import { Point } from "../utils/point";
import {
  centererStyle,
  ellipsisStyle,
  getBoxStyle,
  getRgbaColor,
  stretchStyle,
} from "../utils/styles";
import Slider from "../components/Slider";
import { useWheel } from "../decorators/useWheel";
import { WheelScalingK } from "../utils/constants";
import { VirtualGrid } from "../components/VirtualGrid";
import ResizableControl from "../components/ResizableControl";

export default {
  title: "Demo/Carousel",
  component: VirtualList,
  parameters: {},
} as ComponentMeta<typeof VirtualList>;

const Template: ComponentStory<typeof VirtualList> = (args) => {
  const viewBox = BoundingBox.createByDimensions(0, 0, 500, 70);

  const [sliderValue, setSliderValue] = useState<NumbersRange>(
    new NumbersRange(0, 0.3)
  );
  const [element, setElement] = useCallbackRef();

  const viewSize = viewBox.dx;
  const totalSize = viewSize / sliderValue.size;

  const sizeBounds = useMemo(() => new NumbersRange(0.2, 1), []);

  const handleDrag = useCallback(
    (delta: Point) => {
      setSliderValue((prevValue) => {
        const bounds = NumbersRange.normalizationBounds();
        return bounds.clampInner(prevValue.shift(-delta.x / totalSize));
      });
    },
    [totalSize]
  );

  useDragMovement({ element, onChange: handleDrag });

  const handleWheel = useCallback(
    (delta: number) => {
      setSliderValue((prevValue) => {
        const bounds = NumbersRange.normalizationBounds();

        return bounds.clipInner(
          prevValue.scale(delta * WheelScalingK).constrainSize(0.5, sizeBounds)
        );
      });
    },
    [sizeBounds]
  );

  useWheel(element, handleWheel);

  const renderItem = (columnIndex: number) =>
    CellRenderer.renderItem(0, columnIndex);

  return (
    <>
      <div
        ref={setElement}
        style={{
          display: "inline-block",
          background: "orange",
          userSelect: "none",
          cursor: "grab",
        }}
      >
        <VirtualList
          viewBox={viewBox}
          coordinate={sliderValue.start * totalSize}
          itemSize={totalSize / CellRenderer.columnsCount}
          renderItem={renderItem}
        />
      </div>
      <div style={{ position: "relative", ...getBoxStyle(viewBox) }}>
        <VirtualList
          viewBox={viewBox}
          coordinate={0}
          itemSize={viewSize / CellRenderer.columnsCount}
          renderItem={renderItem}
        />
        <Slider
          value={sliderValue}
          onChange={setSliderValue}
          sizeBounds={sizeBounds}
        >
          <div
            style={{
              ...stretchStyle,
              background: getRgbaColor("#FFFFFF", 0.3),
              border: "1px solid orange",
            }}
          />
        </Slider>
      </div>
    </>
  );
};

export const WithSlider = Template.bind({});

export const WithResizable: ComponentStory<typeof VirtualList> = (args) => {
  const [controlValue, setControlValue] = useState<BoundingBox>(
    BoundingBox.createByDimensions(0, 0, 0.2, 0.2)
  );
  const [element, setElement] = useCallbackRef();

  function handleWheel(delta: number) {
    setControlValue((prevValue) => {
      return prevValue.scale(delta * WheelScalingK);
    });
  }

  useWheel(element, handleWheel);

  const viewBox = BoundingBox.createByDimensions(0, 0, 500, 500);
  const totalSizeVector = new Point(
    viewBox.dx / controlValue.dx,
    viewBox.dy / controlValue.dy
  );

  const handleDrag = function (delta: Point) {
    setControlValue((prevValue) =>
      prevValue.shift(delta.div(totalSizeVector).negate())
    );
  };

  useDragMovement({ element, onChange: handleDrag });

  return (
    <>
      <div
        ref={setElement}
        style={{
          position: "relative",
          display: "inline-block",
          background: "orange",
          userSelect: "none",
          cursor: "grab",
        }}
      >
        <VirtualGrid
          viewBox={viewBox}
          dx={totalSizeVector.x / CellRenderer.columnsCount}
          dy={totalSizeVector.y / CellRenderer.rowsCount}
          coordinates={controlValue.origin.mul(totalSizeVector)}
          renderItem={CellRenderer.renderItem}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          background: "blue",
          userSelect: "none",
        }}
      >
        <VirtualGrid
          viewBox={viewBox}
          dx={viewBox.dx / CellRenderer.columnsCount}
          dy={viewBox.dy / CellRenderer.rowsCount}
          coordinates={new Point(0, 0)}
          renderItem={CellRenderer.renderItem}
        />
        <ResizableControl value={controlValue} onChange={setControlValue}>
          <div
            style={{
              ...stretchStyle,
              background: getRgbaColor("#FFFFFF", 0.3),
              border: "1px solid orange",
            }}
          />
        </ResizableControl>
      </div>
    </>
  );
};

class CellRenderer {
  private static items = [
    "lavender",
    "thistle",
    "plum",
    "violet",
    "orchid",
    "fuchsia",
    "magenta",
    "mediumOrchid",
    "mediumPurple",
    "blueViolet",
    "darkViolet",
    "darkOrchid",
    "darkMagenta",
    "purple",
    "indigo",
    "slateBlue",
    "darkSlateBlue",
  ];

  static columnsCount = this.items.length;
  static rowsCount = 20;

  static renderItem = (rowIndex: number = 0, columnIndex: number) => {
    if (rowIndex < 0 || rowIndex >= this.rowsCount) {
      return null;
    }

    const color = this.items[columnIndex];

    return (
      <div
        style={{ ...stretchStyle, padding: `${8}px`, boxSizing: "border-box" }}
      >
        <div
          style={{
            ...centererStyle,
            ...stretchStyle,
            padding: `${8}px`,
            boxSizing: "border-box",
            backgroundColor: color,
          }}
        >
          <div style={ellipsisStyle}>{color}</div>
        </div>
      </div>
    );
  };
}

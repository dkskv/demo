import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDragMovement } from "../decorators/dnd";
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
import { useScale } from "../decorators/useScale";
import { WheelScalingK } from "../utils/constants";
import { VirtualGrid } from "../components/VirtualGrid";
import ResizableControl from "../components/ResizableControl";
import { clamp } from "ramda";

export default {
  title: "Demo/Carousel",
  component: VirtualList,
  parameters: {},
} as ComponentMeta<typeof VirtualList>;

const Template: ComponentStory<typeof VirtualList> = (args) => {
  const renderer = useCellRenderer();

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

  const handleScale = useCallback(
    (delta: number, point: Point) => {
      setSliderValue((prevValue) => {
        const bounds = NumbersRange.normalizationBounds();

        const k = delta * WheelScalingK;

        return bounds.clipInner(
          prevValue
            .scale(k)
            .constrainSize(sizeBounds)
            .moveTo(prevValue.denormalizeNumber(point.x), point.x)
        );
      });
    },
    [sizeBounds]
  );

  useScale(element, handleScale);

  const renderItem = (columnIndex: number) =>
    renderer.renderItem(0, columnIndex);

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
          itemSize={totalSize / renderer.columnsCount}
          renderItem={renderItem}
        />
      </div>
      <div style={{ position: "relative", ...getBoxStyle(viewBox) }}>
        <VirtualList
          viewBox={viewBox}
          coordinate={0}
          itemSize={viewSize / renderer.columnsCount}
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

function useSlowdown() {
  const [speed, setSpeed] = useState(0);
  const request = useRef<number | null>(null);
  const k = useRef<number>(0);
  // const prevTimestamp = useRef<number | null>();

  const slow = useCallback(function () {
    request.current = requestAnimationFrame((timestamp: number) => {
      setSpeed((prevSpeed) => {
        // const dt = timestamp - (prevTimestamp.current ?? timestamp);
        // prevTimestamp.current = timestamp;

        const nextSpeed = prevSpeed * k.current;

        if (Math.abs(nextSpeed) < 0.1) {
          request.current = null;
          return 0;
        }

        slow();
        return nextSpeed;
      });
    });
  }, []);

  const handleChange = useCallback(
    (value: number) => {
      setSpeed(value);

      if (request.current === null) {
        slow();
      }
    },
    [slow]
  );

  const setK = useCallback((value: number) => {
    k.current = value;
  }, []);

  useEffect(
    () =>
      function () {
        request.current && cancelAnimationFrame(request.current);
      },
    []
  );

  return [speed, handleChange, setK] as const;
}

export const WithMomentum: ComponentStory<typeof VirtualList> = (args) => {
  const renderer = useCellRenderer(CellRenderer.manyColors);

  const viewBox = BoundingBox.createByDimensions(0, 0, 500, 70);

  const [value, setValue] = useState<number>(0);
  const [element, setElement] = useCallbackRef();

  const [speed, setSpeed, slowdown] = useSlowdown();

  const isGrabRef = useRef(false);

  const itemSize = 100;

  const maxValue = itemSize * renderer.columnsCount - viewBox.dx;

  useEffect(() => {
    if (!isGrabRef.current) {
      setValue((prevValue) => {
        return clamp(0, maxValue, prevValue + speed);
      });
    }
  }, [speed, renderer, maxValue]);

  function handleDrag(delta: Point) {
    isGrabRef.current = true;
    setSpeed(-delta.x);
    slowdown(0.9);

    setValue((prevValue) => {
      return clamp(0, maxValue, prevValue - delta.x);
    });
  }

  const handleDragEnd = useCallback(() => {
    isGrabRef.current = false;
    slowdown(0.98);
  }, [slowdown]);

  useDragMovement({ element, onChange: handleDrag, onEnd: handleDragEnd });

  const renderItem = (columnIndex: number) =>
    renderer.renderItem(0, columnIndex);

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
          coordinate={value}
          itemSize={itemSize}
          renderItem={renderItem}
        />
      </div>
      <div
        style={{
          ...getBoxStyle(BoundingBox.createByDimensions(0, 0, 500, 10)),
          background: "grey",
          position: "relative",
        }}
      >
        {speed > 0 && (
          <div
            style={{
              ...getBoxStyle(
                BoundingBox.createByDimensions(250, 0, (250 * speed) / 20, 10)
              ),
              background: "purple",
              position: "absolute",
            }}
          />
        )}
        {speed < 0 && (
          <div
            style={{
              ...getBoxStyle(
                new BoundingBox(250 + (250 * speed) / 20, 250, 0, 10)
              ),
              background: "purple",
              position: "absolute",
            }}
          />
        )}
      </div>
    </>
  );
};

export const WithResizable: ComponentStory<typeof VirtualList> = (args) => {
  const renderer = useCellRenderer();

  const [controlValue, setControlValue] = useState<BoundingBox>(
    BoundingBox.createByDimensions(0, 0, 0.2, 0.2)
  );

  const outer = BoundingBox.createByDimensions(0, 0, 1, 1);

  const lengthBounds = new NumbersRange(0.2, 1);

  const [element, setElement] = useCallbackRef();

  function handleScale(delta: number, p: Point) {
    setControlValue((prevValue) => {
      return prevValue
        .scale(delta * WheelScalingK)
        .constrainSize(lengthBounds, lengthBounds)
        .moveTo(prevValue.denormalizePoint(p), p)
        .clampByOuter(outer);
    });
  }

  useScale(element, handleScale);

  const viewBox = BoundingBox.createByDimensions(0, 0, 500, 500);
  const totalSizeVector = new Point(
    viewBox.dx / controlValue.dx,
    viewBox.dy / controlValue.dy
  );

  const handleDrag = function (delta: Point) {
    setControlValue((prevValue) =>
      prevValue.shift(delta.div(totalSizeVector).negate()).clampByOuter(outer)
    );
  };

  useDragMovement({ element, onChange: handleDrag });

  return (
    <div style={{ display: "flex" }}>
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
          dx={totalSizeVector.x / renderer.columnsCount}
          dy={totalSizeVector.y / renderer.rowsCount}
          coordinates={controlValue.origin.mul(totalSizeVector)}
          renderItem={renderer.renderItem}
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
          dx={viewBox.dx / renderer.columnsCount}
          dy={viewBox.dy / renderer.rowsCount}
          coordinates={new Point(0, 0)}
          renderItem={renderer.renderItem}
        />
        <ResizableControl
          value={controlValue}
          onChange={setControlValue}
          sizeBounds={{ width: lengthBounds, height: lengthBounds }}
        >
          <div
            style={{
              ...stretchStyle,
              background: getRgbaColor("#FFFFFF", 0.3),
              border: "1px solid orange",
            }}
          />
        </ResizableControl>
      </div>
    </div>
  );
};

function useCellRenderer(colors?: string[]) {
  return useMemo(() => new CellRenderer(colors), [colors]);
}

class CellRenderer {
  public static colorsPreset = [
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

  public static manyColors = [
    ...this.colorsPreset,
    ...this.colorsPreset,
    ...this.colorsPreset,
    ...this.colorsPreset,
  ];

  constructor(private items: string[] = CellRenderer.colorsPreset) {}

  public columnsCount = this.items.length;
  public rowsCount = 20;

  public renderItem = (rowIndex: number, columnIndex: number) => {
    if (rowIndex < 0 || rowIndex >= this.rowsCount) {
      return null;
    }

    const color = this.items[columnIndex];

    return (
      <div
        style={{ ...stretchStyle, padding: `${8}%`, boxSizing: "border-box" }}
      >
        <div
          style={{
            ...centererStyle,
            ...stretchStyle,
            padding: `${8}%`,
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

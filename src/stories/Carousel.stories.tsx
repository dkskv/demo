import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDragMovement } from "../decorators/dnd";
import { VirtualList } from "../components/VirtualList";
import { useCallbackRef } from "../hooks";
import { BoundingBox } from "../utils/boundingBox";
import { Point } from "../utils/point";
import { centererStyle, ellipsisStyle, stretchStyle } from "../utils/styles";
import { clamp, minBy } from "ramda";

export default {
  title: "Demo",
  parameters: {},
} as ComponentMeta<any>;

function getBrakingImpulse(srcImpulse: number, frictionForce: number, dt: number) {
  return minBy(
    Math.abs,
    -srcImpulse,
    Math.sign(srcImpulse) * -frictionForce * dt
  );
}

export const SwipeContainer: ComponentStory<typeof VirtualList> = () => {
  const renderer = useCellRenderer(CellRenderer.manyColors);

  const [element, setElement] = useCallbackRef();
  const viewBox = BoundingBox.createByDimensions(0, 0, 500, 70);
  const itemSize = 100;

  const [coordinate, setCoordinate] = useState<number>(0);
  const maxCoordinate = itemSize * renderer.columnsCount - viewBox.dx;
  const maxOverflow = 100;

  const impulse = useRef<number>(0);

  const dragTimestamp = useRef<number>(0);

  const request = useRef<number>(0);

  function clampExtendedCoordinate(coordinate: number, overflowZone: number) {
    return clamp(-overflowZone, maxCoordinate + overflowZone, coordinate);
  }

  // todo: как я должен понять по названию, что это не относится к 0 и maxCoordinate?
  function isEdgeCoordinate(coordinate: number, overflowZone: number) {
    return coordinate === -overflowZone || coordinate === maxCoordinate + overflowZone;
  }

  function inExtrusionZone(coordinate: number) {
    return coordinate < 0 || coordinate > maxCoordinate;
  }

  const startMoving = () => {
    let prevTimestamp: number | null;

    request.current = requestAnimationFrame(function self(timestamp: number) {
      prevTimestamp = prevTimestamp ?? timestamp;

      const dt = timestamp - prevTimestamp;
      prevTimestamp = timestamp;

      setCoordinate((prevCoordinate) => {
        const friction = 0.03;
        const extrusion = 0.2;

        const brakingImpulse = getBrakingImpulse(impulse.current, friction, dt);
        const extrusionImpulse =
          dt *
          (prevCoordinate < 0
            ? extrusion
            : prevCoordinate > maxCoordinate
            ? -extrusion
            : 0);

        impulse.current += brakingImpulse + extrusionImpulse;
        const velocity = impulse.current / 1;
        const nextCoordinate = clampExtendedCoordinate(prevCoordinate + velocity, maxOverflow);

        const hasLeftExtrusionZone = inExtrusionZone(prevCoordinate) && !inExtrusionZone(nextCoordinate);
        
        if (isEdgeCoordinate(nextCoordinate, maxOverflow) || hasLeftExtrusionZone) {
          impulse.current = 0;
        }
        
        if (impulse.current !== 0 || inExtrusionZone(nextCoordinate)) {
          requestAnimationFrame(self);
        }
        
        if (hasLeftExtrusionZone) {
          return nextCoordinate - prevCoordinate > 0 ? 0 : maxCoordinate;
        }

        return nextCoordinate;
      });
    });
  };

  const stopMoving = () => {
    cancelAnimationFrame(request.current);
  };

  function handleDragStart() {
    stopMoving();
  }

  function handleDrag(delta: Point) {
    dragTimestamp.current = performance.now();

    setCoordinate((prevCoordinate) => {
      impulse.current = -delta.x;

      if (prevCoordinate < 0 && impulse.current < 0) {
        impulse.current *= 1 - prevCoordinate / -maxOverflow;
      } else if (prevCoordinate > maxCoordinate && impulse.current > 0) {
        impulse.current *= 1 - (prevCoordinate - maxCoordinate) / maxOverflow;
      }

      return clampExtendedCoordinate(prevCoordinate + impulse.current, maxOverflow);
    });
  }

  const handleDragEnd = useCallback(() => {
    if (
      performance.now() - dragTimestamp.current < 40 ||
      inExtrusionZone(coordinate)
    ) {
      startMoving();
    }
  }, [coordinate]);

  useDragMovement({
    element,
    onChange: handleDrag,
    onStart: handleDragStart,
    onEnd: handleDragEnd,
  });

  return (
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
        coordinate={coordinate}
        itemSize={itemSize}
        renderItem={(columnIndex: number) =>
          renderer.renderItem(0, columnIndex)
        }
      />
    </div>
  );
};

function useCellRenderer(colors?: string[]) {
  return useMemo(() => new CellRenderer(colors), [colors]);
}

// todo: переименовать в cardRenderer и соответствующе упростить
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
    // ...this.colorsPreset,
    // ...this.colorsPreset,
    // ...this.colorsPreset,
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

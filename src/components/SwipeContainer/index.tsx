import { clamp, minBy } from "ramda";
import { useEffect, useRef, useState } from "react";
import { useDragMovement } from "../../decorators/dnd";
import { useActualRef } from "../../decorators/useActualRef";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { Directions, IDirection } from "../../utils/direction";
import { Point } from "../../utils/point";
import { getBoxStyle } from "../../utils/styles";
import { getBoxOnPage } from "../../utils/dom";
import { Space } from "../Space";
import { NumbersRange } from "../../utils/numbersRange";

interface IProps {
  box: BoundingBox;
  children: React.ReactNode;
  direction?: IDirection;
}

function calcBrakingImpulse(
  srcImpulse: number,
  frictionForce: number,
  dt: number
) {
  return minBy(
    Math.abs,
    -srcImpulse,
    Math.sign(srcImpulse) * -frictionForce * dt
  );
}

function getBoxLength(box: BoundingBox, direction: IDirection) {
  return direction.rangesOfBox(box)[0].size;
}

export const SwipeContainer: React.FC<IProps> = ({
  box,
  children,
  direction = Directions.horizontal,
}) => {
  const [element, setElement] = useCallbackRef();

  const [contentLength, setContentLength] = useState(0);

  useEffect(() => {
    const content = element?.childNodes?.[0];

    if (content instanceof HTMLElement) {
      const contentBox = getBoxOnPage(content);
      setContentLength(getBoxLength(contentBox, direction));
    }
  }, [element, direction]);

  useEffect(() => {
    setCoordinate(0);
  }, [direction]);

  const [coordinate, setCoordinate] = useState<number>(0);
  const actualCoordinate = useActualRef(coordinate);
  const maxCoordinate = Math.max(
    0,
    contentLength - getBoxLength(box, direction)
  );
  const maxOverflow = 100;

  const impulse = useRef<number>(0);
  const dragTimestamp = useRef<number>(0);
  const request = useRef<number>(0);

  function clampExtendedCoordinate(coordinate: number, overflowZone: number) {
    return clamp(-overflowZone, maxCoordinate + overflowZone, coordinate);
  }

  function inExtrusionZone(coordinate: number) {
    return coordinate < 0 || coordinate > maxCoordinate;
  }

  function placeOnEdge(coordinate: number) {
    return coordinate < 0 ? 0 : maxCoordinate;
  }

  const startMoving = () => {
    function doStep(
      coordinate: number,
      impulse: number,
      dt: number
    ): { coordinate: number; impulse: number } {
      const friction = 0.03;
      const extrusion = 0.05;

      const extrusionImpulse =
        dt *
        (coordinate < 0
          ? extrusion
          : coordinate > maxCoordinate
          ? -extrusion
          : 0);

      const nextImpulse =
        impulse + extrusionImpulse + calcBrakingImpulse(impulse, friction, dt);

      const velocity = nextImpulse / 1;
      const movedCoordinate = coordinate + velocity;

      const nextCoordinate = clampExtendedCoordinate(
        movedCoordinate,
        maxOverflow
      );
      const didStoppedByLimit = nextCoordinate !== movedCoordinate;
      const didLeaveExtrusionZone =
        inExtrusionZone(coordinate) && !inExtrusionZone(nextCoordinate);

      return {
        coordinate: didLeaveExtrusionZone
          ? placeOnEdge(coordinate)
          : nextCoordinate,
        impulse: didStoppedByLimit || didLeaveExtrusionZone ? 0 : nextImpulse,
      };
    }

    cancelAnimationFrame(request.current);

    let prevTimestamp: number;

    (function move() {
      request.current = requestAnimationFrame((timestamp: number) => {
        const dt = timestamp - (prevTimestamp ?? timestamp);
        prevTimestamp = timestamp;

        setCoordinate((coordinate) => {
          const step = doStep(coordinate, impulse.current, dt);

          if (step.impulse !== 0 || inExtrusionZone(step.coordinate)) {
            move();
          }

          impulse.current = step.impulse;
          return step.coordinate;
        });
      });
    })();
  };

  function handleDragStart() {
    cancelAnimationFrame(request.current);
  }

  function handleDrag(delta: Point) {
    dragTimestamp.current = performance.now();

    setCoordinate((prevCoordinate) => {
      impulse.current = -direction.coordinatesOfPoint(delta)[0];

      if (prevCoordinate < 0 && impulse.current < 0) {
        impulse.current *= 1 - prevCoordinate / -maxOverflow;
      } else if (prevCoordinate > maxCoordinate && impulse.current > 0) {
        impulse.current *= 1 - (prevCoordinate - maxCoordinate) / maxOverflow;
      }

      return clampExtendedCoordinate(
        prevCoordinate + impulse.current,
        maxOverflow
      );
    });
  }

  const handleDragEnd = () => {
    if (
      performance.now() - dragTimestamp.current < 40 ||
      inExtrusionZone(actualCoordinate.current)
    ) {
      startMoving();
    }
  };

  useDragMovement({
    element,
    onChange: handleDrag,
    onStart: handleDragStart,
    onEnd: handleDragEnd,
  });

  const containerLength = getBoxLength(box, direction);

  return (
    <Space size={8} direction={direction.opposite}>
      <div
        ref={setElement}
        style={{
          display: "inline-block",
          background: "SkyBlue",
          userSelect: "none",
          cursor: "grab",
          position: "relative",
          overflow: "hidden",
          ...getBoxStyle(box),
        }}
      >
        <div
          style={{
            position: "absolute",
            [direction.cssKeys.thickness]: "100%",
            [direction.cssKeys.normalCoordinate]: 0,
            [direction.cssKeys.coordinate]: -coordinate,
          }}
        >
          {children}
        </div>
      </div>
      <Scrollbar
        direction={direction}
        length={containerLength}
        thickness={5}
        range={NumbersRange.createByDelta(
          coordinate / contentLength,
          containerLength / contentLength
        )}
      />
    </Space>
  );
};

interface IScrollbarProps {
  thickness: number;
  length: number;
  direction: IDirection;
  // В нормализованном виде
  range: NumbersRange;
}

const Scrollbar: React.FC<IScrollbarProps> = ({
  direction,
  length,
  thickness,
  range,
}) => {
  const box = direction.boxFromRanges(
    new NumbersRange(0, length),
    new NumbersRange(0, thickness)
  );

  const thumbBox = direction.boxFromRanges(
    range.map((n) => n * length),
    new NumbersRange(0, thickness)
  );

  return (
    <div
      style={{
        position: "relative",
        ...getBoxStyle(box),
        background: "Dimgrey",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...getBoxStyle(thumbBox),
          background: "yellow",
        }}
      />
    </div>
  );
};

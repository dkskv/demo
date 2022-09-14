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
import { NumbersRange } from "../../utils/numbersRange";
import { useTheme } from "../../decorators/theme";

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

  const [impulse, setImpulse] = useState<number>(0);
  const actualImpulse = useActualRef(impulse);
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
          const step = doStep(coordinate, actualImpulse.current, dt);

          if (step.impulse !== 0 || inExtrusionZone(step.coordinate)) {
            move();
          }

          setImpulse(step.impulse);
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
      let impulse = -direction.coordinatesOfPoint(delta)[0];

      if (prevCoordinate < 0 && impulse < 0) {
        impulse *= 1 - prevCoordinate / -maxOverflow;
      } else if (prevCoordinate > maxCoordinate && impulse > 0) {
        impulse *= 1 - (prevCoordinate - maxCoordinate) / maxOverflow;
      }

      setImpulse(impulse);

      return clampExtendedCoordinate(prevCoordinate + impulse, maxOverflow);
    });
  }

  const handleDragEnd = () => {
    if (
      performance.now() - dragTimestamp.current < 40 ||
      inExtrusionZone(actualCoordinate.current)
    ) {
      startMoving();
    } else {
      setImpulse(0);
    }
  };

  const { isDrag } = useDragMovement({
    element,
    onChange: handleDrag,
    onStart: handleDragStart,
    onEnd: handleDragEnd,
  });

  const containerLength = getBoxLength(box, direction);

  const theme = useTheme();

  return (
    <div
      ref={setElement}
      style={{
        display: "inline-block",
        background: theme.backgroundColor,
        userSelect: "none",
        cursor: "grab",
        position: "relative",
        overflow: "hidden",
        borderRadius: theme.largeBorderRadius,
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
      <div
        style={{
          position: "absolute",
          [direction.reversed.cssKeys.normalCoordinate]: 0,
        }}
      >
        <Scrollbar
          isActive={impulse !== 0 || isDrag}
          direction={direction}
          length={containerLength}
          thickness={5}
          range={NumbersRange.createByDelta(
            coordinate / contentLength,
            containerLength / contentLength
          )}
        />
      </div>
    </div>
  );
};

interface IScrollbarProps {
  thickness: number;
  length: number;
  direction: IDirection;
  // В нормализованном виде
  range: NumbersRange;
  isActive: boolean;
}

const Scrollbar: React.FC<IScrollbarProps> = ({
  direction,
  length,
  thickness,
  range,
  isActive,
}) => {
  const box = direction.boxFromRanges(
    new NumbersRange(0, length),
    new NumbersRange(0, thickness)
  );

  const thumbBox = direction.boxFromRanges(
    range.map((n) => n * length),
    new NumbersRange(0, thickness)
  );

  const theme = useTheme();

  return (
    <div
      style={{
        ...getBoxStyle(box),
        position: "relative",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...getBoxStyle(thumbBox),
          background: theme.scrollColor,
          transitionProperty: "opacity",
          transitionDuration: "500ms",
          borderRadius: theme.smallBorderRadius,
          border: `1px solid ${theme.strokeColor}`,
          boxSizing: "border-box",
          opacity: isActive ? 1 : 0,
        }}
      />
    </div>
  );
};

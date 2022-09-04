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

interface IProps {
  box: BoundingBox;
  children: React.ReactNode;
  direction?: IDirection;
}

function getBrakingImpulse(
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

  const contentLength = (() => {
    const content = element?.childNodes?.[0];

    if (!(content instanceof HTMLElement)) {
      return 0;
    }

    const contentBox = getBoxOnPage(content);

    return getBoxLength(contentBox, direction);
  })();

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

  // todo: как я должен понять по названию, что это не относится к 0 и maxCoordinate?
  function isEdgeCoordinate(coordinate: number, overflowZone: number) {
    return (
      coordinate === -overflowZone ||
      coordinate === maxCoordinate + overflowZone
    );
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
        const nextCoordinate = clampExtendedCoordinate(
          prevCoordinate + velocity,
          maxOverflow
        );

        const hasLeftExtrusionZone =
          inExtrusionZone(prevCoordinate) && !inExtrusionZone(nextCoordinate);

        if (
          isEdgeCoordinate(nextCoordinate, maxOverflow) ||
          hasLeftExtrusionZone
        ) {
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

  return (
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
  );
};

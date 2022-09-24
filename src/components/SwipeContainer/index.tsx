import { useEffect, useMemo, useRef, useState } from "react";
import { useDragMovement } from "../../decorators/dnd";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { Directions, IDirection } from "../../utils/direction";
import { Point } from "../../utils/point";
import { getBoxStyle } from "../../utils/styles";
import { getBoxOnPage } from "../../utils/dom";
import { NumbersRange } from "../../utils/numbersRange";
import { useTheme } from "../../decorators/theme";
import { ScrollConstraints, ScrollingState } from "./utils";
import { Scrollbar } from "../Scrollbar";

interface IProps {
  box: BoundingBox;
  children: React.ReactNode;
  direction?: IDirection;
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
  const dragTimestamp = useRef<number>(0);
  const request = useRef<number>(0);

  const [contentLength, setContentLength] = useState(0);

  useEffect(() => {
    const content = element?.childNodes?.[0];

    if (content instanceof HTMLElement) {
      const contentBox = getBoxOnPage(content);
      setContentLength(getBoxLength(contentBox, direction));
    }
  }, [element, direction]);

  useEffect(() => {
    setScrollingState((state) => state.reset());
  }, [direction]);

  const maxCoordinate = Math.max(
    0,
    contentLength - getBoxLength(box, direction)
  );

  const scrollingConstraints = useMemo(
    () => new ScrollConstraints(maxCoordinate, 100),
    [maxCoordinate]
  );

  const [scrollingState, setScrollingState] = useState(
    () => new ScrollingState(0, scrollingConstraints, 0)
  );

  useEffect(() => {
    setScrollingState((state) => state.setConstraints(scrollingConstraints));
  }, [scrollingConstraints]);

  const startMoving = () => {
    cancelAnimationFrame(request.current);
    let prevTimestamp: number;

    (function move() {
      request.current = requestAnimationFrame((timestamp: number) => {
        const dt = timestamp - (prevTimestamp ?? timestamp);
        prevTimestamp = timestamp;

        setScrollingState((state) => {
          const nextState = state.doInertialMove(dt);

          if (nextState.isActive()) {
            move();
          }

          return nextState;
        });
      });
    })();
  };

  function handleDragStart() {
    cancelAnimationFrame(request.current);
  }

  function handleDrag(delta: Point) {
    dragTimestamp.current = performance.now();
    const impulse = -direction.coordinatesOfPoint(delta)[0];

    setScrollingState((state) =>
      state.setImpulse(impulse).suppressEscapeImpulse().moveByImpulse()
    );
  }

  const handleDragEnd = () => {
    if (
      performance.now() - dragTimestamp.current < 40 ||
      scrollingState.inExtrusionZone
    ) {
      startMoving();
    } else {
      setScrollingState((state) => state.setImpulse(0));
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
          [direction.cssKeys.coordinate]: -scrollingState.coordinate,
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
          isActive={scrollingState.impulse !== 0 || isDrag}
          direction={direction}
          length={containerLength}
          thickness={5}
          viewPort={NumbersRange.byDelta(
            scrollingState.coordinate / contentLength,
            containerLength / contentLength
          )}
        />
      </div>
    </div>
  );
};

import { useEffect, useMemo, useRef, useState } from "react";
import { useCallbackRef } from "../../decorators/useCallbackRef";
import { BoundingBox } from "../../entities/boundingBox";
import { Directions, IDirection } from "../../entities/direction";
import { getBoxStyle } from "../../utils/styles";
import { getBoxOnPage } from "../../utils/dom";
import { NumbersRange } from "../../entities/numbersRange";
import { useTheme } from "../../decorators/theme";
import { ScrollIndicator } from "../ScrollIndicator";
import { useDrag } from "../Draggable/useDrag";
import { IDragEvent } from "../../utils/drag";
import { ScrollConstraints } from "./utils/scrollConstraints";
import { ScrollingState } from "./utils/scrollingState";

interface IProps {
  box: BoundingBox;
  children: React.ReactNode;
  direction?: IDirection;
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
      setContentLength(direction.length(contentBox.size));
    }
  }, [element, direction]);

  useEffect(() => {
    setScrollingState((state) => state.reset());
  }, [direction]);

  const containerLength = direction.length(box.size);
  const maxCoordinate = Math.max(0, contentLength - containerLength);

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

  function handleDrag({ movement }: IDragEvent) {
    dragTimestamp.current = performance.now();
    const impulse = -direction.coordinatesOfPoint(movement)[0];

    setScrollingState((state) =>
      state.setImpulse(impulse).suppressEscapeImpulse().moveByImpulse()
    );
  }

  const [isDrag, setIsDrag] = useState(false);

  function handleDragStart() {
    setIsDrag(true);
    cancelAnimationFrame(request.current);
  }

  const handleDragEnd = () => {
    setIsDrag(false);

    if (
      performance.now() - dragTimestamp.current < 40 ||
      scrollingState.inExtrusionZone
    ) {
      startMoving();
    } else {
      setScrollingState((state) => state.setImpulse(0));
    }
  };

  useDrag({
    element,
    onChange: handleDrag,
    onStart: handleDragStart,
    onEnd: handleDragEnd,
  });

  const viewPort = NumbersRange.byDelta(
    scrollingState.coordinate,
    containerLength
  );

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
        <ScrollIndicator
          isActive={scrollingState.impulse !== 0 || isDrag}
          direction={direction}
          length={containerLength}
          thickness={5}
          viewPort={viewPort.map((n) => n / contentLength)}
        />
      </div>
    </div>
  );
};

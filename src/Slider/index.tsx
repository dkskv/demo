import { clamp } from "ramda";
import React, { useCallback, useMemo, useState } from "react";
import { useCallbackRef } from "../hooks";
import { useResize } from "../Resizable/hooks";
import { resizableStyle } from "../Resizable/utils";
import { EBoxSide, IPosition } from "../utils/geometry";
import "./index.css";

interface Props {
  min: number;
  max: number;
  minRange?: number;
}

const Slider: React.VFC<Props> = ({ min, max, minRange = 0 }) => {
  const [range, setRange] = useState({ begin: 0, end: 100 });

  const position = useMemo(() => {
    return {
      x: range.begin,
      width: range.end - range.begin,
      y: 0,
      height: 10,
    };
  }, [range]);

  const thumbKeys = useMemo(() => [EBoxSide.left, EBoxSide.right], []);

  const [container, setContainerRef] = useCallbackRef();
  const [track, setTrackRef] = useCallbackRef();

  const handleSlide = useCallback(
    ({ x, width }: IPosition) => {
      if (!container) {
        return;
      }

      const { width: containerWidth } = container.getBoundingClientRect();

      setRange({
        begin: clamp(0, containerWidth, x),
        end: clamp(0, containerWidth, x + width),
      });
    },
    [container]
  );

  const { thumbs } = useResize({
    element: track,
    position,
    onChange: handleSlide,
    thumbKeys,
  });

  const { top, ...style } = resizableStyle(position);

  return (
    <div ref={setContainerRef} className="Container">
      <div ref={setTrackRef} className="Track" style={style}>
        {thumbs}
      </div>
    </div>
  );
};

export default Slider;

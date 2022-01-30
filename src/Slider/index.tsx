import React, { useCallback, useMemo, useState } from "react";
import { useCallbackRef } from "../hooks";
import { useResize } from "../Resizable/hooks";
import { resizableStyle } from "../Resizable/utils";
import {
  clampPositionInDimensions,
  EBoxSide,
  IPosition,
} from "../utils/geometry";
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

  const [track, setTrackRef] = useCallbackRef();

  const handleSlide = useCallback(
    (position: IPosition) => {
      const parent = track?.parentElement;

      if (!parent) {
        return;
      }

      const { x, width } = clampPositionInDimensions(
        position,
        parent.getBoundingClientRect()
      );

      setRange({ begin: x, end: x + width });
    },
    [track]
  );

  const { thumbs } = useResize({
    element: track,
    position,
    onChange: handleSlide,
    thumbKeys,
  });

  const { top, ...style } = resizableStyle(position);

  return (
    <div className="Container">
      <div ref={setTrackRef} className="Track" style={style}>
        {thumbs}
      </div>
    </div>
  );
};

export default Slider;

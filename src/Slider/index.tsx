import React, { useCallback, useMemo, useState } from "react";
import { useCallbackRef } from "../hooks";
import { useResize } from "../Resizable/hooks";
import { IThumbKey, resizableStyle } from "../Resizable/utils";
import { EBoxSide, IPosition } from "../utils/geometry";
import "./index.css";
import {
  EOrientation,
  IRange,
  TrackRangeConverter,
  updatePosition,
} from "./utils";

interface Props {
  trackRange?: IRange;
  minRangeWidth?: number;
  trackThickness?: number;
  orientation?: EOrientation;
}

const Slider: React.VFC<Props> = ({
  trackRange,
  minRangeWidth = 0,
  trackThickness = 10,
  orientation = EOrientation.horizontal,
}) => {
  const { from, to } = TrackRangeConverter;

  const [range, setRange] = useState({ begin: 0, end: 100 });

  const position = useMemo(
    () => from(range, orientation, trackThickness),
    [from, range, orientation, trackThickness]
  );

  const thumbKeys = useMemo(() => [EBoxSide.left, EBoxSide.right], []);

  const [track, setTrackRef] = useCallbackRef();

  const handleSlide = useCallback(
    (position: IPosition, { thumbKey }: { thumbKey: IThumbKey }) => {
      const parent = track?.parentElement;

      if (!parent) {
        return;
      }

      const isDrag = !thumbKey;
      const newPosition = updatePosition(
        parent.getBoundingClientRect(),
        isDrag,
        position
      );

      setRange(to(newPosition, orientation));
    },
    [to, orientation, track]
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

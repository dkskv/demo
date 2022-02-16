import React from "react";
import { useCallbackRef } from "../hooks";
import { IRange } from "../utils/common";
import { useSlide } from "./hooks";
import "./index.css";
import { EOrientation, sliderTrackStyle } from "./utils";

interface Props {
  value: IRange;
  onChange(value: IRange): void;
  minRangeLength?: number;
  trackThickness?: number;
  orientation?: EOrientation;
}

const Slider: React.VFC<Props> = ({
  value,
  onChange,
  minRangeLength = 0.2,
  trackThickness = 10,
  orientation = EOrientation.horizontal,
}) => {
  const [track, setTrackRef] = useCallbackRef();

  const { thumbs } = useSlide({
    element: track,
    range: value,
    onChange,
    thickness: trackThickness,
    orientation,
    lengthBounds: { min: minRangeLength, max: Infinity },
  });

  return (
    <div className="Container">
      <div
        ref={setTrackRef}
        className="Track"
        style={sliderTrackStyle(value, orientation, trackThickness)}
      >
        {thumbs}
      </div>
    </div>
  );
};

export default Slider;

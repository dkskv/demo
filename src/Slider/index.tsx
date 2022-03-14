import React from "react";
import { useCallbackRef } from "../hooks";
import { IBounds, IRange } from "../utils/common";
import { IOrientationAttrs, Orientations } from "../utils/orientation";
import { useSlide } from "./hooks";
import "./index.css";
import { sliderTrackStyle } from "./utils";

interface Props {
  value: IRange;
  onChange(value: IRange): void;
  lengthBounds?: IBounds;
  trackThickness?: number;
  orientation?: IOrientationAttrs;
}

const Slider: React.VFC<Props> = ({
  value,
  onChange,
  lengthBounds,
  trackThickness = 10,
  orientation = Orientations.horizontal,
}) => {
  const [track, setTrackRef] = useCallbackRef();

  const { thumbs } = useSlide({
    element: track,
    range: value,
    onChange,
    thickness: trackThickness,
    orientation,
    lengthBounds,
  });

  return (
    <div className="Container">
      <div
        ref={setTrackRef}
        className="Track"
        style={sliderTrackStyle(value, trackThickness, orientation)}
      >
        {thumbs}
      </div>
    </div>
  );
};

export default Slider;

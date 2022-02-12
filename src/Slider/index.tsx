import React from "react";
import { useCallbackRef } from "../hooks";
import { useSlide } from "./hooks";
import "./index.css";
import { EOrientation, ISliderRange, sliderTrackStyle } from "./utils";

// Мне нужен удобный способ превращать stateless в stateful

interface Props {
  value: ISliderRange;
  onChange(value: ISliderRange): void;
  // minRangeLength?: number;
  trackThickness?: number;
  orientation?: EOrientation;
}

// Снаружи вообще не должны знать о пикселях
const Slider: React.VFC<Props> = ({
  value,
  onChange,
  trackThickness = 10,
  orientation = EOrientation.horizontal,
}) => {
  const [track, setTrackRef] = useCallbackRef();

  const { thumbs } = useSlide({
    element: track,
    value,
    onChange,
    thickness: trackThickness,
    orientation,
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

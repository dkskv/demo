import React from "react";
import { useCallbackRef } from "../hooks";
import { Range } from "../utils/range";
import { IOrientation, Orientations } from "../utils/orientation";
import { useNormalizedRange, useSlide } from "./hooks";
import "./index.css";
import { getTrackOuterBox, sliderTrackStyle } from "./utils";
import { Bounds } from "../utils/bounds";
import { denormalize } from "../utils/normalization";

interface Props {
  /** Нормализованный диапазон (в пределах от 0 до 1) */
  value: Range;
  onChange(value: Range): void;
  sizeBounds?: Bounds;
  trackThickness?: number;
  orientation?: IOrientation;
}

const Slider: React.VFC<Props> = ({
  value,
  onChange,
  sizeBounds = Bounds.without(),
  trackThickness = 10,
  orientation = Orientations.horizontal,
}) => {
  const [track, setTrackRef] = useCallbackRef();

  const outerLength = track ? orientation.getRangeOfBox(getTrackOuterBox(track)).size : 0; 
 
  const [range, handleChange] = useNormalizedRange(value, outerLength, onChange);
  
  const thumbsElements = useSlide({
    element: track,
    range,
    onChange: handleChange,
    thickness: trackThickness,
    orientation,
    sizeBounds: denormalize(sizeBounds, outerLength)
  });

  return (
    <div className="Container">
      <div
        ref={setTrackRef}
        className="Track"
        style={sliderTrackStyle(value, trackThickness, orientation)}
      >
        {thumbsElements}
      </div>
    </div>
  );
};

export default Slider;

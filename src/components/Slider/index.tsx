import React, { useCallback } from "react";
import { useCallbackRef } from "../../hooks";
import { IOrientation, Orientations } from "../../utils/orientation";
import { useSlide } from "./hooks";
import "./index.css";
import { sliderTrackStyle, validateSliderRange } from "./utils";
import { Range } from "../../utils/range";
import { denormalize, normalize } from "../../utils/normalization";
import { getBoxStyle } from "../../utils/dom";
import { BoundingBox } from "../../utils/boundingBox";

export interface ISliderProps {
  /** Нормализованный диапазон (в пределах от 0 до 1) */
  value: Range;
  onChange(value: Range): void;
  boundingBox: BoundingBox;
  orientation?: IOrientation;
  sizeBounds?: Range;
}

const Slider: React.VFC<ISliderProps> = ({
  value,
  onChange,
  boundingBox,
  sizeBounds = Range.infinite(),
  orientation = Orientations.horizontal,
}) => {
  validateSliderRange(value);

  const [track, setTrackRef] = useCallbackRef();

  // todo: ломает мемоизацию колбека
  const boundsRange = orientation.getRangeOfBox(boundingBox.moveToOrigin());

  const handleChange = useCallback(
    (range: Range, isDrag: boolean) => {
      const boundedRange = isDrag
        ? boundsRange.clampInner(range)
        : boundsRange.clipInner(range);

      onChange(normalize(boundedRange, boundsRange.size));
    },
    [onChange, boundsRange]
  );

  const thumbsElements = useSlide({
    range: denormalize(value, boundsRange.size),
    thickness: orientation.getNormalRangeOfBox(boundingBox).size,
    draggableElement: track,
    onChange: handleChange,
    orientation,
    sizeBounds: denormalize(sizeBounds, boundsRange.size),
  });

  return (
    <div className="Container" style={getBoxStyle(boundingBox)}>
      <div
        ref={setTrackRef}
        className="Track"
        style={sliderTrackStyle(orientation, value)}
      >
        {thumbsElements}
      </div>
    </div>
  );
};

export default Slider;

import React, { useCallback } from "react";
import { useCallbackRef } from "../../hooks";
import { Orientations } from "../../utils/orientation";
import { ISlideParams, useSlide } from "./hooks";
import "./index.css";
import { sliderTrackStyle, validateSliderRange } from "./utils";
import { NumbersRange } from "../../utils/numbersRange";
import { denormalize, normalize } from "../../utils/normalization";
import { getBoxStyle } from "../../utils/styles";
import { BoundingBox } from "../../utils/boundingBox";
import { Thumb } from "../Thumb";

export interface ISliderProps
  extends Pick<
    Partial<ISlideParams>,
    "orientation" | "sizeBounds" | "ThumbComponent"
  > {
  /** Нормированный диапазон (в пределах от 0 до 1) */
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  /** Контейнер, ограничивающий трек слайдера */
  boundingBox: BoundingBox;
}

const Slider: React.VFC<ISliderProps> = ({
  value,
  onChange,
  boundingBox,
  sizeBounds = NumbersRange.infinite(),
  orientation = Orientations.horizontal,
  ThumbComponent = Thumb,
}) => {
  validateSliderRange(value);

  const [track, setTrackRef] = useCallbackRef();

  // todo: ломает мемоизацию колбека
  const boundsRange = orientation.getRangeOfBox(boundingBox.resetOrigin());

  const handleChange = useCallback(
    (range: NumbersRange, isDrag: boolean) => {
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
    ThumbComponent,
  });

  return (
    <div className="Container" style={getBoxStyle(boundingBox)}>
      <div
        ref={setTrackRef}
        className="Track"
        style={sliderTrackStyle(orientation, value)}
      ></div>
      {thumbsElements}
    </div>
  );
};

export default Slider;

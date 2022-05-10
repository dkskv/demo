import React, { useCallback } from "react";
import { useCallbackRef } from "../../hooks";
import { IOrientation, Orientations } from "../../utils/orientation";
import { validateSliderRange } from "./utils";
import { NumbersRange } from "../../utils/numbersRange";
import { denormalize, normalize } from "../../utils/normalization";
import { getBoxStyle } from "../../utils/styles";
import { BoundingBox } from "../../utils/boundingBox";
import { Thumb } from "../Thumb";
import { sliderTrackStyle } from "./styles";
import { IResizeParams, useDragBox, useResize } from "../Resizable/hooks";

export interface ISliderProps
  extends Pick<Partial<IResizeParams>, "ThumbComponent"> {
  /** Нормированный диапазон (в пределах от 0 до 1) */
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  // todo: Принимать только ширину и длину
  /** Контейнер, ограничивающий трек слайдера */
  boundingBox: BoundingBox;

  /** Диапазон возможных размеров трека */
  sizeBounds?: NumbersRange;

  orientation?: IOrientation;

  trackContent?: React.ReactNode;
}

const Slider: React.FC<ISliderProps> = ({
  value,
  onChange,
  boundingBox,
  sizeBounds = NumbersRange.infinite(),
  orientation = Orientations.horizontal,
  ThumbComponent = Thumb,
  trackContent,
  children
}) => {
  validateSliderRange(value);

  const [parallelRange, thicknessRange] = orientation.rangesOfBox(boundingBox);

  const rangeSize = parallelRange.size;

  const normalizeRange = useCallback(
    (range: NumbersRange) => {
      return normalize(range, rangeSize);
    },
    [rangeSize]
  );

  const denormalizeRange = useCallback(
    (range: NumbersRange) => {
      return denormalize(range, rangeSize);
    },
    [rangeSize]
  );

  const [track, setTrackRef] = useCallbackRef();

  const handleChange = useCallback(
    (box: BoundingBox) => {
      onChange(normalizeRange(orientation.rangesOfBox(box)[0]));
    },
    [onChange, normalizeRange, orientation]
  );

  const handleDrag = useCallback(
    (box: BoundingBox) => handleChange(boundingBox.clampInner(box)),
    [boundingBox, handleChange]
  );

  const handleResize = useCallback(
    (box: BoundingBox) => handleChange(boundingBox.clipInner(box)),
    [boundingBox, handleChange]
  );

  useDragBox({ element: track, onChange: handleDrag });

  const thumbsElements = useResize({
    box: orientation.boxFromRanges(denormalizeRange(value), thicknessRange),
    onChange: handleResize,
    thumbKeys: orientation.sides,
    sizeBounds: { [orientation.lengthKey]: denormalizeRange(sizeBounds) },
    keepAspectRatio: false,
    ThumbComponent,
  });

  return (
    <div style={{ position: "relative", ...getBoxStyle(boundingBox) }}>
      {children}
      <div ref={setTrackRef} style={sliderTrackStyle(orientation, value)}>
        {trackContent}
      </div>
      {thumbsElements}
    </div>
  );
};

export default Slider;

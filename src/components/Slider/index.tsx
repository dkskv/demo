import React, { useCallback } from "react";
import { IOrientation, Orientations } from "../../utils/orientation";
import { NumbersRange } from "../../utils/numbersRange";
import { BoundingBox } from "../../utils/boundingBox";
import ResizableControl, { IResizableControlProps } from "../ResizableControl";

export interface ISliderProps
  extends Pick<IResizableControlProps, "ThumbComponent"> {
  /** Нормированный диапазон (в пределах от 0 до 1) */
  value: NumbersRange;
  onChange(value: NumbersRange): void;

  /** Диапазон возможных размеров трека */
  sizeBounds?: NumbersRange;

  orientation?: IOrientation;
}

const Slider: React.FC<ISliderProps> = ({
  value,
  onChange,
  sizeBounds = NumbersRange.infinite(),
  orientation = Orientations.horizontal,
  ...rest
}) => {
  const handleChange = useCallback(
    (box: BoundingBox) => {
      onChange(orientation.rangesOfBox(box)[0]);
    },
    [onChange, orientation]
  );

  return (
    <ResizableControl
      {...rest}
      value={orientation.boxFromRanges(value, NumbersRange.normalizationBounds())}
      onChange={handleChange}
      sizeBounds={{ [orientation.lengthKey]: sizeBounds }}
      thumbKeys={orientation.sides}
    />
  );
};

export default Slider;

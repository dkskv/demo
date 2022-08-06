import React, { useCallback } from "react";
import { IOrientation, Orientations } from "../../utils/orientation";
import { NumbersRange } from "../../utils/numbersRange";
import { BoundingBox } from "../../utils/boundingBox";
import ResizableControl, { IResizableControlProps } from "../ResizableControl";
import { IPressedKeys, noop } from "../../utils/common";

export interface ISliderProps
  extends Omit<
    IResizableControlProps,
    "value" | "onChange" | "onStart" | "onEnd" | "sizeBounds"
  > {
  /** Нормированный диапазон (в пределах от 0 до 1) */
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  onStart?(value: NumbersRange): void;
  onEnd?(value: NumbersRange): void;

  /** Диапазон возможных размеров трека */
  sizeBounds?: NumbersRange;

  orientation?: IOrientation;
}

const Slider: React.FC<ISliderProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeBounds = NumbersRange.infinite(),
  orientation = Orientations.horizontal,
  ...rest
}) => {
  const handleChange = useOrientedCallback(onChange, orientation);
  const handleStart = useOrientedCallback(onStart, orientation);
  const handleEnd = useOrientedCallback(onEnd, orientation);

  return (
    <ResizableControl
      {...rest}
      value={orientation.boxFromRanges(
        value,
        NumbersRange.normalizationBounds()
      )}
      onChange={handleChange}
      onStart={handleStart}
      onEnd={handleEnd}
      sizeBounds={{ [orientation.lengthKey]: sizeBounds }}
      thumbKeys={orientation.sides}
    />
  );
};

function useOrientedCallback(
  callback: (box: NumbersRange, pressedKeys: IPressedKeys) => void,
  orientation: IOrientation
) {
  return useCallback(
    (box: BoundingBox, pressedKeys: IPressedKeys) => {
      callback(orientation.rangesOfBox(box)[0], pressedKeys);
    },
    [callback, orientation]
  );
}

export default Slider;

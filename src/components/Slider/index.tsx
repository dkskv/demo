import React, { useCallback } from "react";
import { IDirection, Directions } from "../../utils/direction";
import { NumbersRange } from "../../utils/numbersRange";
import { BoundingBox } from "../../utils/boundingBox";
import ResizableControl, { IResizableControlProps } from "../ResizableControl";
import { IPressedKeys, noop } from "../../utils/common";

export interface ISliderProps
  extends Omit<
    IResizableControlProps,
    "value" | "onChange" | "onStart" | "onEnd" | "sizeBounds" | "thumbKeys"
  > {
  /** Нормированный диапазон (в пределах от 0 до 1) */
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  onStart?(value: NumbersRange): void;
  onEnd?(value: NumbersRange): void;

  /** Диапазон возможных размеров трека */
  sizeBounds?: NumbersRange;
  direction?: IDirection;

  thumbKeys?: [0] | [1] | [0, 1];
}

const Slider: React.FC<ISliderProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeBounds = NumbersRange.infinite(),
  direction = Directions.horizontal,
  thumbKeys = [0, 1],
  ...rest
}) => {
  const handleChange = useDirectedCallback(onChange, direction);
  const handleStart = useDirectedCallback(onStart, direction);
  const handleEnd = useDirectedCallback(onEnd, direction);

  return (
    <ResizableControl
      {...rest}
      value={direction.boxFromRanges(
        directRange(value, direction),
        NumbersRange.normalizationBounds()
      )}
      onChange={handleChange}
      onStart={handleStart}
      onEnd={handleEnd}
      sizeBounds={{ [direction.lengthKey]: sizeBounds }}
      thumbKeys={direction.sides.filter((_, i) =>
        (thumbKeys as number[]).includes(i)
      )}
    />
  );
};

function directRange(range: NumbersRange, direction: IDirection) {
  return direction.isReversed ? range.map((a) => 1 - a).invert() : range;
}

function useDirectedCallback(
  callback: (box: NumbersRange, pressedKeys: IPressedKeys) => void,
  direction: IDirection
) {
  return useCallback(
    (box: BoundingBox, pressedKeys: IPressedKeys) => {
      const range = direction.rangesOfBox(box)[0];

      callback(directRange(range, direction), pressedKeys);
    },
    [callback, direction]
  );
}

export default Slider;

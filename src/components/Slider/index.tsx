import React, { useCallback } from "react";
import { IDirection, Directions } from "../../utils/direction";
import { NumbersRange } from "../../utils/numbersRange";
import { BoundingBox } from "../../utils/boundingBox";
import { ResizableControl } from "../ResizableControl";
import { IPressedKeys, noop } from "../../utils/common";
import { SizeBounds } from "../../utils/sizeBounds";
import { centererStyle, getBoxStyle, stretchStyle } from "../../utils/styles";
import { useTheme } from "../../decorators/theme";

export interface ISliderProps {
  /** Нормированный диапазон (в пределах от 0 до 1) */
  value: NumbersRange;
  onChange(value: NumbersRange): void;
  onStart?(value: NumbersRange): void;
  onEnd?(value: NumbersRange): void;

  length: number;
  thickness: number;

  isDraggable?: boolean;

  /** Диапазон возможных размеров трека */
  sizeBounds?: NumbersRange;
  direction?: IDirection;

  thumbKeys?: [0] | [1] | [0, 1];
}

function getDirectedSizeBounds(bounds: NumbersRange, direction: IDirection) {
  const boxOfBounds = direction.boxFromRanges(bounds, NumbersRange.infinite());
  return new SizeBounds(boxOfBounds.xsRange, boxOfBounds.ysRange);
}

export const Slider: React.FC<ISliderProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeBounds = NumbersRange.infinite(),
  direction = Directions.horizontal,
  thumbKeys = [0, 1],
  length,
  thickness,
  isDraggable,
}) => {
  const handleChange = useDirectedCallback(onChange, direction);
  const handleStart = useDirectedCallback(onStart, direction);
  const handleEnd = useDirectedCallback(onEnd, direction);

  const outerBox = direction.boxFromRanges(
    new NumbersRange(0, length),
    new NumbersRange(0, thickness)
  );

  function renderExtendedControlArea() {
    const extensionSize = 20;

    return (
      <div
        style={{
          width: `calc(100% + ${extensionSize}px)`,
          height: `calc(100% + ${extensionSize}px)`,
          flexShrink: 0,
          // background: "rgba(255,255,255,0.1)",
        }}
      />
    );
  }

  const theme = useTheme();

  return (
    <div
      style={{
        position: "relative",
        background: theme.backgroundColor,
        borderRadius: theme.largeBorderRadius,
        ...getBoxStyle(outerBox),
      }}
    >
      <ResizableControl
        isDraggable={isDraggable}
        outerBox={outerBox}
        value={direction.boxFromRanges(
          directRange(value, direction),
          NumbersRange.normalizationBounds()
        )}
        onChange={handleChange}
        onStart={handleStart}
        onEnd={handleEnd}
        sizeBounds={getDirectedSizeBounds(sizeBounds, direction)}
        thumbKeys={direction.sides.filter((_, i) =>
          (thumbKeys as number[]).includes(i)
        )}
      >
        <div
          style={{
            ...stretchStyle,
            ...centererStyle,
            borderRadius: theme.largeBorderRadius,
            background: theme.primaryColor,
          }}
        >
          {renderExtendedControlArea()}
        </div>
      </ResizableControl>
    </div>
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

import { useCallback } from "react";
import { useResize } from "../Resizable/hooks";
import { IThumbKey } from "../Resizable/utils";
import { IOrientation } from "../utils/orientation";
import {
  Converter,
  getTrackOuterBox,
  validateSliderRange,
} from "./utils";
import { Range } from "../utils/range";
import { BoundingBox } from "../utils/boundingBox";
import { Constraints } from "../utils/constraints";
import { denormalize, normalize } from "../utils/normalization";

interface IProps<T> {
  element: T | null;
  range: Range;
  onChange(range: Range): void;
  thickness: number;
  orientation: IOrientation;
  sizeConstraints: Constraints;
  renderThumb?(key: IThumbKey): React.ReactElement;
}

/** Использует Resizable для реализации слайдера */
export function useSlide<T extends HTMLElement>({
  element,
  range,
  thickness,
  orientation,
  sizeConstraints,
  onChange,
}: IProps<T>) {
  validateSliderRange(range);
  const handleResize = useCallback(
    (box: BoundingBox, { thumbKey }: { thumbKey: IThumbKey }) => {
      const isDrag = !thumbKey;

      const containerBox = getTrackOuterBox(element!);

      const constrainedBox = isDrag
        ? containerBox.moveToOrigin().clampInner(box)
        : containerBox.moveToOrigin().clipInner(box);

      onChange(Converter.toSliderRange(constrainedBox, orientation));
    },
    [onChange, element, orientation]
  );

  const thumbsElements = useResize({
    element,
    box: Converter.toResizableBox(range, thickness, orientation),
    onChange: handleResize,
    thumbKeys: orientation.sides,
    sizesConstraints: orientation.getSizeConstraints(sizeConstraints),
  });

  return thumbsElements;
}

/** Позволяет использовать нормализованный диапазон (в пределах от 0 до 1) */
export function useNormalizedRange(
  normalizedRange: Range,
  outerLength: number,
  onChange: (r: Range) => void
) {
  const range = denormalize(normalizedRange, outerLength);

  const handleChange = useCallback(
    (changedRange: Range) => {
      onChange(normalize(changedRange, outerLength));
    },
    [onChange, outerLength]
  );

  return [range, handleChange] as const;
}

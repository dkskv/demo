import { mapObjIndexed } from "ramda";
import { useCallback, useMemo } from "react";
import { useResize } from "../Resizable/hooks";
import { IThumbKey } from "../Resizable/utils";
import { clampInBox } from "../Resizable/utils/geometry";
import { IBounds, IRange } from "../utils/common";
import { EBoxSide, IPosition } from "../utils/geometry";
import { Converter, EOrientation, validateSliderRange } from "./utils";

interface IProps<T> {
  element: T | null;
  range: IRange;
  onChange(range: IRange): void;
  thickness?: number;
  orientation?: EOrientation;
  /**
   * Подумать на счет возврата конфига вместо thumbs. И предоставить дефолтный рендерер из утилит.
   */
  renderThumb?(key: IThumbKey): React.ReactElement;
  lengthBounds?: IBounds;
}

export function useSlide<T extends HTMLElement>({
  element,
  range,
  thickness = 10,
  orientation = EOrientation.horizontal,
  lengthBounds,
  onChange,
}: IProps<T>) {
  validateSliderRange(range);

  const parentElement = element?.parentElement;

  const handleResize = useCallback(
    (position: IPosition, options: { thumbKey: IThumbKey }) => {
      if (!parentElement) {
        return;
      }

      const parentPosition: IPosition = parentElement.getBoundingClientRect();

      const clampedPosition = clampInBox(
        parentPosition,
        position,
        !options.thumbKey
      );

      onChange(
        Converter.toSliderRange(clampedPosition, parentPosition, orientation)
      );
    },
    [onChange, orientation, parentElement]
  );

  const thumbKeys = useMemo(
    () =>
      orientation === EOrientation.horizontal
        ? [EBoxSide.left, EBoxSide.right]
        : [EBoxSide.top, EBoxSide.bottom],
    [orientation]
  );

  const position = parentElement
    ? Converter.toResizablePosition(
        range,
        parentElement.getBoundingClientRect(),
        orientation,
        thickness
      )
    : null;

  const dimensionsBounds = (() => {
    if (parentElement && lengthBounds) {
      const key = orientation === EOrientation.horizontal ? "width" : "height";

      return {
        [key]: mapObjIndexed(
          (a) => a * parentElement.getBoundingClientRect()[key],
          lengthBounds
        ),
      };
    }
  })();

  const { thumbs } = useResize({
    element,
    position,
    onChange: handleResize,
    thumbKeys,
    dimensionsBounds,
  });

  return { thumbs };
}

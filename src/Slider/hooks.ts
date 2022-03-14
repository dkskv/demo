import { useCallback, useMemo } from "react";
import { useKeepingRefForEquals } from "../decorators/useKeepingRefForEquals";
import { useResize } from "../Resizable/hooks";
import { IThumbKey } from "../Resizable/utils";
import { clampInBox } from "../Resizable/utils/geometry";
import { IBounds, IRange } from "../utils/common";
import { getElementPosition } from "../utils/dom";
import { denormalize, IPosition } from "../utils/geometry";
import { IOrientationAttrs } from "../utils/orientation";
import { Converter, validateSliderRange } from "./utils";

interface IProps<T> {
  element: T | null;
  range: IRange;
  onChange(range: IRange): void;
  thickness: number;
  orientation: IOrientationAttrs;
  /**
   * Подумать на счет возврата конфига вместо thumbs. И предоставить дефолтный рендерер из утилит.
   */
  renderThumb?(key: IThumbKey): React.ReactElement;
  lengthBounds?: IBounds;
}

export function useSlide<T extends HTMLElement>({
  element,
  range,
  thickness,
  orientation,
  lengthBounds,
  onChange,
}: IProps<T>) {
  validateSliderRange(range);

  const parentElement = element?.parentElement;

  const parentPosition = useKeepingRefForEquals(
    () => (parentElement ? getElementPosition(parentElement) : null),
    [parentElement]
  );

  const handleResize = useCallback(
    (position: IPosition, options: { thumbKey: IThumbKey }) => {
      if (!parentPosition) {
        return;
      }

      const clampedPosition = clampInBox(
        parentPosition,
        position,
        !options.thumbKey
      );

      onChange(
        Converter.toSliderRange(clampedPosition, parentPosition, orientation)
      );
    },
    [onChange, orientation, parentPosition]
  );

  const thumbKeys = useMemo(
    () => [orientation.startSide, orientation.endSide],
    [orientation]
  );

  const position = parentPosition
    ? Converter.toResizablePosition(
        range,
        parentPosition,
        orientation,
        thickness
      )
    : null;

  const dimensionsBounds = (() => {
    if (parentPosition && lengthBounds) {
      const parentLength = parentPosition[orientation.length];

      return { [orientation.length]: denormalize(lengthBounds, parentLength) };
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

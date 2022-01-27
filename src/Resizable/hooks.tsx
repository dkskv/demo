import { useCallback, useMemo } from "react";
import { useDrag } from "../Draggable/hooks";
import {
  getDimensions,
  IPoint,
  IPosition,
  IPositionChangeCallback,
} from "../utils";
import Thumb from "./Thumb";
import {
  getThumbs,
  IDimensionsConstraints,
  defaultDimensionsConstraints,
  type CornerThumb,
} from "./utils";

interface IProps<T> {
  element: T | null;
  position: IPosition;
  onChange: IPositionChangeCallback;
  isDrag?: boolean;
  dimensionsConstraints?: Partial<IDimensionsConstraints>;
  isRateably?: boolean;
}

export function useResize<T extends HTMLElement>({
  element,
  position,
  onChange,
  isDrag = true,
  dimensionsConstraints = {},
  isRateably = false,
}: IProps<T>) {
  const onThumbChange = useCallback(
    (thumb: CornerThumb, point: IPoint /* forceRateably ? */) => {
      const clampedPoint = thumb.clamp(
        getDimensions(position),
        { ...defaultDimensionsConstraints, ...dimensionsConstraints },
        isRateably,
        point
      );

      const nextPosition = thumb.updateRectanglePosition(
        clampedPoint,
        position
      );

      onChange(nextPosition);
    },
    [onChange, position, dimensionsConstraints, isRateably]
  );

  const thumbs = useMemo(() => {
    if (element) {
      const dimensions = getDimensions(position);

      return getThumbs().map((thumb) => (
        <Thumb
          key={thumb.constructor.name}
          callbackProps={thumb}
          point={thumb.getInitialPoint(dimensions)}
          onChange={onThumbChange}
        />
      ));
    }
  }, [element, position, onThumbChange]);

  useDrag({ element: isDrag ? element : null, onChange });

  return { thumbs };
}

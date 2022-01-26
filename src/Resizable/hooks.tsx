import { clamp } from "ramda";
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
  updatePosition,
  IThumKey,
  getThumbs,
  IDimensionsConstraints,
  cornerConstraints,
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
    (name: IThumKey, point: IPoint) => {
      const {
        min = { width: 0, height: 0 },
        max = { width: Infinity, height: Infinity },
      } = dimensionsConstraints;

      const dimensions = getDimensions(position);

      const { left, right, top, bottom } = cornerConstraints(name, dimensions, {
        min,
        max,
      });

      const clampedPoint = {
        left: clamp(left, right, point.left),
        top: clamp(top, bottom, point.top),
      };

      const nextPosition = updatePosition(
        { name, point: clampedPoint },
        position
      );

      onChange(nextPosition);
    },
    [onChange, position, dimensionsConstraints]
  );

  const thumbs = useMemo(() => {
    if (element) {
      return getThumbs(position).map(({ name, point }) => (
        <Thumb key={name} name={name} point={point} onChange={onThumbChange} />
      ));
    }
  }, [element, position, onThumbChange]);

  useDrag({ element: isDrag ? element : null, onChange });

  return { thumbs };
}

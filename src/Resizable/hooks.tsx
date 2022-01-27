import { useCallback, useMemo } from "react";
import { useDrag } from "../Draggable/hooks";
import {
  getDimensions,
  IPoint,
  IPosition,
  IPositionChangeCallback,
  IPressedKeys,
} from "../utils";
import Thumb from "./Thumb";
import {
  getThumbs,
  IDimensionsBounds,
  defaultDimensionsConstraints,
  type CornerThumb,
} from "./utils";

interface IProps<T> {
  element: T | null;
  position: IPosition;
  onChange: IPositionChangeCallback;
  isDrag?: boolean;
  dimensionsConstraints?: Partial<IDimensionsBounds>;
  onlyRateably?: boolean;
}

export function useResize<T extends HTMLElement>({
  element,
  position,
  onChange,
  isDrag = true,
  dimensionsConstraints = {},
  onlyRateably = false,
}: IProps<T>) {
  const onThumbChange = useCallback(
    (thumb: CornerThumb, point: IPoint, pressedKeys: IPressedKeys) => {
      const clampedPoint = thumb.clampPoint(
        getDimensions(position),
        { ...defaultDimensionsConstraints, ...dimensionsConstraints },
        onlyRateably || pressedKeys.shiftKey,
        point
      );

      const nextPosition = thumb.updateRectanglePosition(
        clampedPoint,
        position
      );

      onChange(nextPosition, pressedKeys);
    },
    [onChange, position, dimensionsConstraints, onlyRateably]
  );

  const thumbs = useMemo(() => {
    if (element) {
      const dimensions = getDimensions(position);

      return getThumbs().map((thumb) => (
        <Thumb
          key={thumb.constructor.name}
          callbackProp={thumb}
          point={thumb.getInitialPoint(dimensions)}
          onChange={onThumbChange}
        />
      ));
    }
  }, [element, position, onThumbChange]);

  useDrag({ element: isDrag ? element : null, onChange });

  return { thumbs };
}

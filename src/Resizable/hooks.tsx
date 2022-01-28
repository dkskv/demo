import { useCallback, useMemo } from "react";
import { useDrag } from "../Draggable/hooks";
import {
  type IPositionChangeCallback,
  type IPressedKeys,
} from "../utils/common";
import { getDimensions, IPoint, IPosition } from "../utils/geometry";
import ThumbComponent from "./Thumb";
import { defaultDimensionsBounds, getThumbs } from "./utils";
import { type IDimensionsBounds } from "./utils/geometry";
import { type Thumb } from "./utils/Thumb";

interface IProps<T> {
  element: T | null;
  position: IPosition;
  onChange: IPositionChangeCallback;
  isDrag?: boolean;
  dimensionsBounds?: Partial<IDimensionsBounds>;
  onlyRateably?: boolean;
}

export function useResize<T extends HTMLElement>({
  element,
  position,
  onChange,
  isDrag = true,
  dimensionsBounds,
  onlyRateably = false,
}: IProps<T>) {
  const onThumbChange = useCallback(
    (thumb: Thumb, point: IPoint, pressedKeys: IPressedKeys) => {
      const nextPosition = thumb.updateBoxPosition(
        {
          boxPosition: position,
          dimensionsBounds: {
            ...defaultDimensionsBounds,
            ...(dimensionsBounds ?? {}),
          },
          isRateably: onlyRateably || pressedKeys.shiftKey,
        },
        point
      );

      onChange(nextPosition, pressedKeys);
    },
    [onChange, position, dimensionsBounds, onlyRateably]
  );

  const thumbs = useMemo(() => {
    if (element) {
      const dimensions = getDimensions(position);

      return getThumbs().map((thumb) => (
        <ThumbComponent
          key={thumb.key}
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

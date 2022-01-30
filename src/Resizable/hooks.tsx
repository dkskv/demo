import { useCallback, useMemo } from "react";
import { useDrag } from "../Draggable/hooks";
import {
  type IPositionChangeCallback,
  type IPressedKeys,
} from "../utils/common";
import { getDimensions, IPoint, IPosition } from "../utils/geometry";
import ThumbComponent from "./Thumb";
import {
  allThumbKeys,
  getThumbs,
  type IThumbKey,
  withDefaultDimensionsBounds,
} from "./utils";
import { type IDimensionsBounds } from "./utils/geometry";
import { type Thumb } from "./utils/Thumb";

interface IProps<T> {
  element: T | null;
  position: IPosition;
  onChange: IPositionChangeCallback;
  renderThumb?(key: IThumbKey): React.ReactElement;
  isDrag?: boolean;
  dimensionsBounds?: Partial<IDimensionsBounds>;
  onlyRateably?: boolean;
  thumbKeys?: IThumbKey[];
}

export function useResize<T extends HTMLElement>({
  element,
  position,
  onChange,
  renderThumb = () => <div className="Thumb" />,
  isDrag = true,
  dimensionsBounds,
  onlyRateably = false,
  thumbKeys = allThumbKeys,
}: IProps<T>) {
  useDrag({ element: isDrag ? element : null, onChange });

  const onThumbChange = useCallback(
    (thumb: Thumb, point: IPoint, pressedKeys: IPressedKeys) => {
      const nextPosition = thumb.updateBoxPosition(
        {
          boxPosition: position,
          dimensionsBounds: withDefaultDimensionsBounds(dimensionsBounds),
          isRateably: onlyRateably || pressedKeys.shiftKey,
        },
        point
      );

      onChange(nextPosition, pressedKeys);
    },
    [onChange, position, dimensionsBounds, onlyRateably]
  );

  const thumbs = (() => {
    if (element) {
      const dimensions = getDimensions(position);

      return getThumbs(thumbKeys).map((thumb, i) => (
        <ThumbComponent
          key={thumb.stringKey}
          callbackProp={thumb}
          point={thumb.getRelativePoint(dimensions)}
          onChange={onThumbChange}
        >
          {renderThumb(thumbKeys[i])}
        </ThumbComponent>
      ));
    }
  })();

  return { thumbs };
}

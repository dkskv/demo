import { useCallback } from "react";
import { useDrag } from "../Draggable/hooks";
import { type IPressedKeys } from "../utils/common";
import { getDimensions, type IPoint, type IPosition } from "../utils/geometry";
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
  position: IPosition | null;
  onChange(
    a: IPosition,
    options: { pressedKeys: IPressedKeys; thumbKey: IThumbKey }
  ): void;
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
    (
      thumb: Thumb,
      point: IPoint,
      { pressedKeys }: { pressedKeys: IPressedKeys }
    ) => {
      if (position) {
        const nextPosition = thumb.updateBoxPosition(
          {
            boxPosition: position,
            dimensionsBounds: withDefaultDimensionsBounds(dimensionsBounds),
            isRateably: onlyRateably || pressedKeys.shiftKey,
          },
          point
        );

        onChange(nextPosition, {
          pressedKeys,
          thumbKey: thumb.key as IThumbKey,
        });
      }
    },
    [onChange, position, dimensionsBounds, onlyRateably]
  );

  const thumbs = (() => {
    if (element && position) {
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

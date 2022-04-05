import { useCallback } from "react";
import { useDrag } from "../Draggable/hooks";
import { BoundingBox } from "../utils/boundingBox";
import { type IPressedKeys } from "../utils/common";
import { Point } from "../utils/point";
import { BoxSizesBounds } from "../utils/boxSizesBounds";
import Thumb from "./Thumb";
import { getThumbs, type IThumbKey } from "./utils";
import { type MovableGroup } from "./utils/movableGroup";

interface IProps<T> {
  element: T | null;
  box: BoundingBox | null;
  onChange(
    a: BoundingBox,
    options: { pressedKeys?: IPressedKeys; thumbKey?: IThumbKey }
  ): void;
  isDrag: boolean;
  sizesBounds: BoxSizesBounds;
  onlyRateably: boolean;
  thumbKeys: readonly IThumbKey[];
  /** todo: Можно просить компонент */
  renderThumb?(key: IThumbKey): React.ReactElement;
}

/**
 * todo: Можно предусмотреть пропс, устанавливающий расположение кнопок: внутри бокса 
 * или на том же уровне
 */

export function useResize<T extends HTMLElement>({
  element,
  box,
  onChange,
  isDrag,
  sizesBounds,
  onlyRateably,
  thumbKeys,
  /** todo: Можно просить компонент */
  renderThumb = () => <div className="Thumb" />,
}: IProps<T>): React.ReactNode {
  const handleDrag = useCallback(
    (point: Point, { pressedKeys }: { pressedKeys: IPressedKeys }) => {
      onChange(box!.setOrigin(point), { pressedKeys });
    },
    [onChange, box]
  );

  useDrag({ element: isDrag ? element : null, onChange: handleDrag });

  const handleChangeThumb = useCallback(
    (
      thumb: MovableGroup,
      innerPoint: Point,
      { pressedKeys }: { pressedKeys: IPressedKeys }
    ) => {
      /** Т.к. кнопки располагаются внутри бокса, а не на том же уровне */
      const outerPoint = innerPoint.add(box!.origin);

      const updatedBox = thumb.updateBox({
        point: outerPoint,
        box: box!,
        sizesBounds,
        isRateably: onlyRateably || pressedKeys.shiftKey,
      });

      onChange(updatedBox, {
        pressedKeys,
        thumbKey: thumb.key as IThumbKey,
      });
    },
    [onChange, box, sizesBounds, onlyRateably]
  );

  if (!element || !box) {
    return null;
  }

  /** Т.к. кнопки располагаются внутри бокса, а не на том же уровне */
  const innerBox = box.moveToOrigin();

  return getThumbs(thumbKeys).map((thumb, i) => (
    <Thumb
      key={thumb.stringKey}
      point={thumb.getPointInBox(innerBox)}
      onChange={(point, keys) => handleChangeThumb(thumb, point, keys)}
    >
      {renderThumb(thumbKeys[i])}
    </Thumb>
  ));
}

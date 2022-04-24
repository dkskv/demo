import { useCallback } from "react";
import { IResizeCallbackOptions, IResizeParams, useResize } from "../Resizable/hooks";
import { IOrientation } from "../../utils/orientation";
import { NumbersRange } from "../../utils/numbersRange";
import { BoundingBox } from "../../utils/boundingBox";

export interface ISlideParams extends Pick<IResizeParams, "ThumbComponent" | "draggableElement"> {
  /** Диапазон трека слайдера */
  range: NumbersRange;

  /** Callback, вызываемый при намерении изменить диапазон трека */
  onChange(range: NumbersRange, isDrag: boolean): void;

  /** Толщина трека */
  thickness: number;

  /** Диапазон возможных размеров трека */
  sizeBounds: NumbersRange;

  orientation: IOrientation;
}

/** Использование Resizable для реализации слайдера (одномерного случая Resizable) */
export function useSlide({
  range,
  thickness,
  draggableElement,
  orientation,
  sizeBounds,
  onChange,
  ThumbComponent
}: ISlideParams) {
  const handleResize = useCallback(
    (box: BoundingBox, { isDrag }: IResizeCallbackOptions) => {
      onChange(orientation.getRangeOfBox(box), isDrag);
    },
    [onChange, orientation]
  );

  const thumbsElements = useResize({
    box: orientation.getBoxFromRanges(range, new NumbersRange(0, thickness)),
    draggableElement,
    onChange: handleResize,
    thumbKeys: orientation.sides,
    sizesBounds: orientation.getSizeBounds(sizeBounds),
    keepAspectRatio: false,
    ThumbComponent
  });

  return thumbsElements;
}
 
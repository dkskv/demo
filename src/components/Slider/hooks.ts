import { useCallback } from "react";
import { IResizeCallbackOptions, useResize } from "../Resizable/hooks";
import { IMovableElementKey } from "../../utils/boxResize";
import { IOrientation } from "../../utils/orientation";
import { Range } from "../../utils/range";
import { BoundingBox } from "../../utils/boundingBox";
import { Thumb } from "../Thumb";

interface IProps<T> {
  range: Range;
  draggableElement: T | null;
  onChange(range: Range, isDrag: boolean): void;
  orientation: IOrientation;
  sizeBounds: Range;
  renderThumb?(key: IMovableElementKey): React.ReactElement;
}

/** Использование Resizable для реализации слайдера (частного случая) */
export function useSlide<T extends HTMLElement>({
  range,
  draggableElement,
  orientation,
  sizeBounds,
  onChange,
}: IProps<T>) {
  const handleResize = useCallback(
    (box: BoundingBox, { isDrag }: IResizeCallbackOptions) => {
      onChange(orientation.getRangeOfBox(box), isDrag);
    },
    [onChange, orientation]
  );

  const thumbsElements = useResize({
    /**
     * todo:
     * - либо передаю толщину контейнера
     * - либо беру их из draggableElement
     * - либо добавляю возможность гибко указывать координаты кнопок Resizable
     */
    box: orientation.getBoxFromRanges(range, new Range(0, 25)),
    draggableElement,
    onChange: handleResize,
    thumbKeys: orientation.sides,
    sizesBounds: orientation.getSizeBounds(sizeBounds),
    onlyRateably: false,
    thumbComponent: Thumb
  });

  return thumbsElements;
}

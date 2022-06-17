import { move } from "ramda";
import { BoundingBox } from "../boundingBox";
import { Point } from "../point";

export interface ISortableItem {
  key: string;
  box: BoundingBox;
}

/** Изменить порядок элементов в соответствии с перемещаемым элементом */
export function order(items: ISortableItem[], movable: ISortableItem) {
  const insertionIndex = items.findIndex((current) => {
    const { ysRange } = current.box;
    const boxCenterY = ysRange.denormalizeNumber(0.5);

    const { y1, y2 } = movable.box;

    // Запас.
    const n = 3;

    // Вытеснение верхней стороной
    if (
      ysRange.includes(y1) &&
      y1 < boxCenterY + n /* && activeIndex > index */
    ) {
      return true;
    }

    // Вытеснение нижней стороной
    if (
      ysRange.includes(y2) &&
      y2 > boxCenterY + n /* && activeIndex < index */
    ) {
      return true;
    }

    return false;
  });

  if (insertionIndex === -1) {
    // todo: также обработать ситуацию, когда movable за пределами
    return items;
  }

  // todo: оптимизировать
  const movableIndex = items.findIndex(({ key }) => key === movable.key);

  return positionEntriesInChain(move(movableIndex, insertionIndex, items));
}

// todo: переименовать
export function positionEntriesInChain(entries: ISortableItem[]) {
  const boxes = positionInChain(entries.map(({ box }) => box));
  return entries.map(({ key }, index) => ({ key, box: boxes[index] }));
}

/** Компактно разместить боксы в цепочку друг за другом */
export function positionInChain(
  items: BoundingBox[] /*, startIndex: number, endIndex: number */
) {
  const nextItems: BoundingBox[] = [];
  let lastY = 0;

  for (const box of items) {
    nextItems.push(box.moveTo(new Point(box.x0, lastY)));

    lastY += box.height;
  }

  return nextItems;
}

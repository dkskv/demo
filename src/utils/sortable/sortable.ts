import { move } from "ramda";
import { BoundingBox } from "../boundingBox";
import { Point } from "../point";

export interface ISortableItem {
  key: string;
  box: BoundingBox;
}

/** Изменить порядок элементов в соответствии с перемещаемым элементом */
export function order(items: ISortableItem[], movable: ISortableItem) {
  // todo: оптимизировать
  const movableIndex = items.findIndex(({ key }) => key === movable.key);
  const dir = Math.sign(movable.box.y0 - items[movableIndex].box.y0);
  let shiftedIndex = movableIndex;

  while (true) {
    if (shiftedIndex < 0) {
      shiftedIndex = 0;
      break;
    }

    if (shiftedIndex > items.length - 1) {
      shiftedIndex = items.length - 1;
      break;
    }

    const { ysRange } = items[shiftedIndex].box;
    const boxCenterY = ysRange.denormalizeNumber(0.5);
    const { y1, y2 } = movable.box;

    if ((dir === -1 && y1 < boxCenterY) || (dir === 1 && y2 > boxCenterY)) {
      shiftedIndex += dir;
    } else {
      shiftedIndex -= dir;
      break;
    }
  }

  return positionEntriesInChain(move(movableIndex, shiftedIndex, items));
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

import { insert, move } from "ramda";
import { BoundingBox } from "../boundingBox";
import { Point } from "../point";

export interface ISortableItem {
  key: string;
  box: BoundingBox;
}

export interface IMovingAction {
  sourceIndex: number;
  point: Point;
}

export function moveIndexAccordingToPosition(
  action: IMovingAction,
  items: ISortableItem[]
) {
  const targetIndex = defineIndexAfterMove(action, items);
  return move(action.sourceIndex, targetIndex, items);
}

// todo: возможно, стоит использовать бинарный поиск для оптимизации
export function insertAccordingToPosition(
  item: ISortableItem,
  items: ISortableItem[]
) {
  const index = defineInsertionIndex(item, items);
  return insert(index, item, items);
}

function distance(a: number, b: number) {
  return Math.abs(a - b);
}

export function defineInsertionIndex(
  item: ISortableItem,
  items: ISortableItem[]
) {
  const insertionY = item.box.center.y;

  const { insertionIndex } = items.reduce(
    (acc, { box }, index) => {
      const distanceToStart = distance(box.y1, insertionY);
      const distanceToEnd = distance(box.y2, insertionY);

      const greaterThanMin =
        distanceToStart > acc.minDistance && distanceToEnd > acc.minDistance;

      return greaterThanMin
        ? acc
        : distanceToEnd > distanceToStart
        ? { insertionIndex: index, minDistance: distanceToStart }
        : { insertionIndex: index + 1, minDistance: distanceToEnd };
    },
    { minDistance: Infinity, insertionIndex: 0 }
  );

  return insertionIndex;
}

export function defineIndexAfterMove(
  { point, sourceIndex }: IMovingAction,
  items: ISortableItem[]
): number {
  const sourceBox = items[sourceIndex].box;
  const actionBox = sourceBox.moveTo(point);

  /** Направление поиска новой позиции перемещаемого элемента */
  const dir = Math.sign(point.y - sourceBox.y0);

  let shiftedIndex = sourceIndex;

  while (true) {
    if (shiftedIndex < 0) {
      shiftedIndex = 0;
      break;
    }

    if (shiftedIndex > items.length - 1) {
      shiftedIndex = items.length - 1;
      break;
    }

    const boxCy = getBoxCy(items[shiftedIndex].box);
    const { y1, y2 } = actionBox;

    if ((dir === -1 && y1 < boxCy) || (dir === 1 && y2 > boxCy)) {
      shiftedIndex += dir;
    } else {
      shiftedIndex -= dir;
      break;
    }
  }

  return shiftedIndex;
}

/** Получить `y` координату центра бокса */
function getBoxCy(box: BoundingBox) {
  return box.ysRange.denormalizeNumber(0.5);
}

/** Компактно разместить элементы в цепочку друг за другом */
export function positionInChain(
  items: ISortableItem[] /*, startIndex: number, endIndex: number */
) {
  const nextItems: ISortableItem[] = [];
  let lastY = 0;

  for (const { key, box } of items) {
    nextItems.push({ key, box: box.moveTo(new Point(0, lastY)) });

    lastY += box.height;
  }

  return nextItems;
}

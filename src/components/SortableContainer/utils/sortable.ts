import { insert, move } from "ramda";
import { BoundingBox } from "../../../entities/boundingBox";
import { Point } from "../../../entities/point";

export interface ISortableItem {
  key: string;
  box: BoundingBox;
}

interface IMovingAction {
  /** Начальный индекс перемещаемого элемента */
  sourceIndex: number;
  /** Точка, в которую переместили элемент */
  endPoint: Point;
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
  { endPoint, sourceIndex }: IMovingAction,
  items: ISortableItem[]
): number {
  const sourceBox = items[sourceIndex].box;
  const movedBox = sourceBox.moveTo(endPoint);
  const searchDirection = Math.sign(endPoint.y - sourceBox.y0);

  for (let index = sourceIndex; true; index += searchDirection) {
    if (index < 0) {
      return 0;
    }

    if (index > items.length - 1) {
      return items.length - 1;
    }

    const currentBoxCy = getBoxCenterY(items[index].box);

    const isOverstep =
      (searchDirection === 1 && movedBox.y2 > currentBoxCy) ||
      (searchDirection === -1 && movedBox.y1 < currentBoxCy);

    if (!isOverstep) {
      return index - searchDirection;
    }
  }
}

/** Получить `y` координату центра бокса */
function getBoxCenterY(box: BoundingBox) {
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

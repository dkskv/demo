import { BoundingBox } from "../boundingBox";
import { ResizingPoint } from "./resizingPoint";
import { Point } from "../point";
import { NumbersRange } from "../numbersRange";
import { EBoxLength } from "../boxParams";

interface IUpdateBoxParams {
  prevBox: BoundingBox;
  resizingPoint: ResizingPoint;
  resizingPointTarget: Point;

  // Ограничения

  aspectRatio: number | null;
  sizeBounds: ISizeBounds;
  outerBox: BoundingBox;
}

export type ISizeBounds = Partial<Record<EBoxLength, NumbersRange>>;

/** Изменить размер бокса, сохранив наложенные ограничения */
export function updateBox({
  prevBox,
  resizingPoint,
  resizingPointTarget,
  aspectRatio,
  sizeBounds,
  outerBox,
}: IUpdateBoxParams): BoundingBox {
  // Изменение размера
  let nextBox = resizingPoint.resizeBox(prevBox, resizingPointTarget);

  const keepAspectRatio = aspectRatio !== null;

  // Сохранение соотношения сторон
  if (keepAspectRatio) {
    nextBox = nextBox.setAspectRatio(aspectRatio);
  }

  // Ограничение размера
  nextBox = constrainSize(nextBox, sizeBounds);

  // Поправка расположения
  nextBox = resizingPoint.keepTransformOrigin(prevBox, nextBox);

  // Ограничение внешним боксом
  nextBox = outerBox.clipInner(nextBox);

  if (keepAspectRatio) {
    const precision = 5;

    if (
      aspectRatio.toPrecision(precision) !==
      nextBox.aspectRatio.toPrecision(precision)
    ) {
      // Если сломалось соотношение сторон, то откатываем изменения
      // p.s. Можно вычислять предельные размеры при `aspectRatio`, но профит низкий
      return prevBox;
    }
  }

  return nextBox;
}

function constrainSize(box: BoundingBox, { width, height }: ISizeBounds) {
  const withoutBounds = NumbersRange.infinite();

  return box.constrainSize(width ?? withoutBounds, height ?? withoutBounds);
}

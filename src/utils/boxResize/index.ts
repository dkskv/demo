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
  // todo: outerBox
}

export type ISizeBounds = Partial<Record<EBoxLength, NumbersRange>>;

/** Изменить размер бокса, сохранив наложенные ограничения */
export function updateBox({
  prevBox,
  resizingPoint,
  resizingPointTarget,
  aspectRatio,
  sizeBounds,
}: IUpdateBoxParams): BoundingBox {
  // Изменение размера
  let nextBox = resizingPoint.resizeBox(prevBox, resizingPointTarget);

  const keepAspectRatio = aspectRatio !== null;

  // Сохранение соотношения сторон
  if (keepAspectRatio) {
    nextBox = nextBox.setAspectRatio(aspectRatio);
  }

  // Ограничение размера
  const boxBeforeClamp = nextBox;
  nextBox = constrainSize(nextBox, sizeBounds);

  // Если ограничение размера сломало соотношение сторон
  if (keepAspectRatio && !nextBox.isEqual(boxBeforeClamp)) {
    // Откатываем изменения
    // p.s. Можно вычислять предельные размеры при `aspectRatio`, но профит низкий
    return prevBox;
  }

  // Поправка расположения
  return resizingPoint.keepTransformOrigin(prevBox, nextBox);
}

function constrainSize(box: BoundingBox, { width, height }: ISizeBounds) {
  if (width) {
    box = box.constrainDx(width);
  }

  if (height) {
    box = box.constrainDy(height);
  }

  return box;
}

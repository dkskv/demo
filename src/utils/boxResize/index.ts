import { BoundingBox } from "../boundingBox";
import { ResizingPoint } from "./resizingPoint";
import { BoxSizesBounds } from "../boxSizesBounds";
import { Point } from "../point";

interface IUpdateBoxParams {
  prevBox: BoundingBox;
  resizingPoint: ResizingPoint;
  resizingPointTarget: Point;

  // Ограничения

  keepAspectRatio: boolean;
  sizesBounds: BoxSizesBounds;
}

/** Изменить размер бокса, сохранив наложенные ограничения */
export function updateBox({
  prevBox,
  resizingPoint,
  resizingPointTarget,
  keepAspectRatio,
  sizesBounds,
}: IUpdateBoxParams): BoundingBox {
  // Изменение размера
  let nextBox = resizingPoint.resizeBox(prevBox, resizingPointTarget);

  // Сохранение соотношения сторон
  if (keepAspectRatio) {
    nextBox = nextBox.setAspectRatio(prevBox.aspectRatio);
  }

  // Ограничение размера
  const boxBeforeClamp = nextBox;
  nextBox = nextBox.constrainDeltas(sizesBounds);

  // Если ограничение размера сломало соотношение сторон
  if (keepAspectRatio && !nextBox.isEqual(boxBeforeClamp)) {
    // Откатываем изменения
    // p.s. Можно вычислять предельные размеры при `aspectRatio`, но профит низкий
    return prevBox;
  }

  // Поправка расположения
  return resizingPoint.keepTransformOrigin(prevBox, nextBox);
}
import { BoundingBox } from "./boundingBox";
import { Point } from "./point";

// Утилиты для работы с Element

export function getPointOnPage(element: Element) {
  const { x, y } = element.getBoundingClientRect();

  return new Point(x, y);
}

export function getOriginOnPage(element: Element) {
  return getPointOnPage(element).subtract(getOriginOffset(element));
}

/** Положение origin внутри элемента */
function getOriginOffset(element: Element) {
  const { transform } = getComputedStyle(element);
  const { m41: translateX, m42: translateY } = new DOMMatrixReadOnly(transform);

  return new Point(translateX, translateY);
}

export function getBoxOnPage(element: Element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return BoundingBox.createByDimensions(x, y, width, height);
}

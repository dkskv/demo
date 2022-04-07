import { BoundingBox } from "./boundingBox";
import { Point } from "./point";

/** Бокс элемента относительно offsetParent */
export function getInnerBoundingBox(element: HTMLElement) {
  return getBoxOnPage(element).placeRelatively(
    getBoxOnPage(element.offsetParent!).origin
  );
}

export function getPointOnPage(element: Element) {
  const { x, y } = element.getBoundingClientRect();

  return new Point(x, y);
}

export function getOriginPointOnPage(element: Element) {
  return getPointOnPage(element).subtract(getOriginOffset(element));
}

function getBoxOnPage(element: Element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return BoundingBox.createByDimensions(x, y, width, height);
}

/** Положение origin внутри элемента */
 function getOriginOffset(element: Element) {
  const { transform } = getComputedStyle(element);
  const { m41: translateX, m42: translateY } = new DOMMatrixReadOnly(transform);

  return new Point(translateX, translateY);
}

export function getPointStyle({ x, y }: Point) {
  return {
    left: `${x}px`,
    top: `${y}px`,
  } as const;
}

export function getBoxStyle(box: BoundingBox) {
  return {
    ...getPointStyle(box.origin),
    width: `${box.dx}px`,
    height: `${box.dy}px`,
  } as const;
}

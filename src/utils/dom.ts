import { BoundingBox } from "../entities/boundingBox";
import { Point } from "../entities/point";

export function getPointOnViewport(element: Element) {
  const { x, y } = element.getBoundingClientRect();
  return new Point(x, y);
}

export function getOriginOnViewport(element: Element) {
  return getPointOnViewport(element).subtract(getOriginOffset(element));
}

/** Положение origin внутри элемента */
function getOriginOffset(element: Element) {
  const { transform } = getComputedStyle(element);
  const { m41: translateX, m42: translateY } = new DOMMatrixReadOnly(transform);
  return new Point(translateX, translateY);
}

export function mapDomRectToBox({ x, y, width, height }: DOMRect) {
  return BoundingBox.byDeltas(x, y, width, height);
}

export function getBoxOnViewport(element: Element) {
  return mapDomRectToBox(element.getBoundingClientRect());
}

export function getOffsetBox({ offsetParent }: HTMLElement) {
  return offsetParent
    ? getBoxOnViewport(offsetParent).resetOrigin()
    : BoundingBox.infinite();
}

/** Получить координаты мыши внутри `currentTarget` */
export function getMouseOffsetPoint(mouseEvent: MouseEvent): Point {
  const targetOrigin = getOriginOnViewport(mouseEvent.currentTarget as Element);
  return getMousePoint(mouseEvent).subtract(targetOrigin);
}

/** Координаты мыши во viewport */
export function getMousePoint(event: MouseEvent) {
  return new Point(event.clientX, event.clientY);
}

export interface IPressedKeys {
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
}

export function extractPressedKeys({
  altKey,
  shiftKey,
  ctrlKey,
}: MouseEvent): IPressedKeys {
  return { altKey, shiftKey, ctrlKey };
}

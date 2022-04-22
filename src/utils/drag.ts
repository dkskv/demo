import { IPressedKeys } from "./common";
import { getOriginOnPage } from "./domElement";
import { Point } from "./point";

interface IMouseEvent
  extends Pick<
    MouseEvent,
    | "preventDefault"
    | "stopPropagation"
    | "target"
    | "pageX"
    | "pageY"
    | "altKey"
    | "shiftKey"
    | "ctrlKey"
  > {}

export interface IDragCallback {
  (a: Point, keys: IPressedKeys): void;
}

/** Подписывает callback на намерение переместить элемент (в координатах страницы) */
export function listenDrag(
  element: Element,
  callback: (point: Point, pressedKeys: IPressedKeys) => void
) {
  return function (downEvent: IMouseEvent) {
    downEvent.preventDefault();
    downEvent.stopPropagation();

    const dragPointInsideElement = getDragPointInsideElement(
      element,
      downEvent
    );

    listenMouseMove((mousePoint, pressedKeys) =>
      callback(mousePoint.subtract(dragPointInsideElement), pressedKeys)
    );
  };
}

function listenMouseMove(callback: IDragCallback) {
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleStop, { once: true });

  function handleMove(event: MouseEvent) {
    callback(getMousePoint(event), extractPressedKeys(event));
  }

  function handleStop() {
    document.removeEventListener("mousemove", handleMove);
  }
}

/** Получить координаты точки захвата внутри элемента */
function getDragPointInsideElement(
  element: Element,
  mouseEvent: IMouseEvent
): Point {
  const elementOrigin = getOriginOnPage(element);
  const mousePoint = getMousePoint(mouseEvent);

  return mousePoint.subtract(elementOrigin);
}

/** Координаты мыши на странице */
function getMousePoint(event: IMouseEvent) {
  /** todo: Почему не clientX? */
  return new Point(event.pageX, event.pageY);
}

function extractPressedKeys({
  altKey,
  shiftKey,
  ctrlKey,
}: MouseEvent): IPressedKeys {
  return { altKey, shiftKey, ctrlKey };
}

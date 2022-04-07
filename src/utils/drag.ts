import { IPressedKeys } from "./common";
import { getOriginPointOnPage, getPointOnPage } from "./dom";
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

export interface IMoveCallback {
  (a: Point, keys: IPressedKeys): void;
}

/**
 * Обработчик перетаскивания элемента (срабатывает на событие `mousedown`)
 * Подписывает callback на изменение координат элемента внутри offsetParent
 */
export function listenDrag(
  target: HTMLElement,
  callback: (point: Point, options: { pressedKeys: IPressedKeys }) => void
) {
  return function (mouseDown: IMouseEvent) {
    mouseDown.preventDefault();
    mouseDown.stopPropagation();

    /**
     * Отступ от точки захвата до origin target элемента:
     * - захват может быть произведен за любую точку элемента
     * - двигать можно только origin элемента
     */
    const mouseShift = getMousePointOnPage(mouseDown).subtract(
      getOriginPointOnPage(target)
    );
    // Отступ, вычитаемый из координат мыши для получения координат target
    const shift = getPointOnPage(target.offsetParent!).add(mouseShift);

    listenMouseMove((mousePoint, pressedKeys) =>
      callback(mousePoint.subtract(shift), { pressedKeys })
    );
  };
}

function listenMouseMove(callback: IMoveCallback) {
  document.addEventListener("mousemove", handleMoveTarget);
  document.addEventListener("mouseup", stopListen);

  function handleMoveTarget(event: MouseEvent) {
    callback(getMousePointOnPage(event), getPressedKeys(event));
  }

  function stopListen() {
    document.removeEventListener("mousemove", handleMoveTarget);
  }
}

function getMousePointOnPage(event: IMouseEvent) {
  return new Point(event.pageX, event.pageY);
}

function getPressedKeys({
  altKey,
  shiftKey,
  ctrlKey,
}: MouseEvent): IPressedKeys {
  return { altKey, shiftKey, ctrlKey };
}

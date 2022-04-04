import { type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";

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

export function createDragHandler(
  area: HTMLElement,
  element: HTMLElement,
  callback: (point: Point, options: { pressedKeys: IPressedKeys }) => void
) {
  return function (mouseDown: IMouseEvent) {
    mouseDown.preventDefault();
    mouseDown.stopPropagation();

    const shift = getShiftFromOrigin(element, mouseDown.pageX, mouseDown.pageY);

    createMoveHandler(area, (point, pressedKeys) =>
      callback(point.add(shift), { pressedKeys })
    );
  };
}

function createMoveHandler(area: HTMLElement, callback: IMoveCallback) {
  document.addEventListener("mousemove", handleMoveTarget);

  document.addEventListener("mouseup", stopListen);

  function stopListen() {
    document.removeEventListener("mousemove", handleMoveTarget);
  }

  const { x: areaX0, y: areaY0 } = area.getBoundingClientRect();

  function handleMoveTarget(event: MouseEvent) {
    const { pageX: mouseX, pageY: mouseY } = event;
    const { altKey, shiftKey, ctrlKey } = event;

    callback(new Point(mouseX - areaX0, mouseY - areaY0), {
      altKey,
      shiftKey,
      ctrlKey,
    });
  }
}

/**
 * Рассчитывает смещение от точки захвата до origin:
 * захват может быть произведен за любую точку элемента, а двигать нужно
 * origin элемента.
 */
function getShiftFromOrigin(
  target: HTMLElement,
  clickX: number,
  clickY: number
) {
  const { x, y } = target.getBoundingClientRect();
  const { translateX, translateY } = getTranslate(target);

  return new Point(x - translateX - clickX, y - translateY - clickY);
}

function getTranslate(element: HTMLElement) {
  const style = getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);

  return { translateX: matrix.m41, translateY: matrix.m42 };
}

export function draggableStyle({ x, y }: Point) {
  return { position: "absolute", left: `${x}px`, top: `${y}px` } as const;
}

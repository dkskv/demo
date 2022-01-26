import {
  getDimensions,
  IPoint,
  IPositionChangeCallback,
  mergeWithAdd,
} from "../utils";

interface IMouseEvent
  extends Pick<
    MouseEvent,
    "preventDefault" | "stopPropagation" | "target" | "pageX" | "pageY"
  > {}

export interface IMoveCallback {
  (a: IPoint): void;
}

export function createDragHandler(
  area: HTMLElement,
  element: HTMLElement,
  callback: IPositionChangeCallback
) {
  return function (mouseDown: IMouseEvent) {
    mouseDown.preventDefault();
    mouseDown.stopPropagation();

    const dimensions = getDimensions(element.getBoundingClientRect());

    const shifts = getShift(element, mouseDown.pageX, mouseDown.pageY);

    createMoveHandler(area, (point) => {
      const elementOrigin = mergeWithAdd(point, shifts);

      return callback({ ...elementOrigin, ...dimensions });
    });
  };
}

function createMoveHandler(area: HTMLElement, callback: IMoveCallback) {
  document.addEventListener("mousemove", handleMoveTarget);

  document.addEventListener("mouseup", stopListen);

  function stopListen() {
    document.removeEventListener("mousemove", handleMoveTarget);
  }

  const { x: areaX0, y: areaY0 } = area.getBoundingClientRect();

  function handleMoveTarget({ pageX: mouseX, pageY: mouseY }: MouseEvent) {
    callback({ x: mouseX - areaX0, y: mouseY - areaY0 });
  }
}

function getShift(target: HTMLElement, clickX: number, clickY: number) {
  const { x, y } = target.getBoundingClientRect();
  const { translateX, translateY } = getTranslate(target);

  return { x: x - translateX - clickX, y: y - translateY - clickY };
}

function getTranslate(element: HTMLElement) {
  const style = getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);

  return { translateX: matrix.m41, translateY: matrix.m42 };
}

//
export function draggableStyle({ x, y }: IPoint) {
  return { position: "absolute", left: `${x}px`, top: `${y}px` } as const;
}

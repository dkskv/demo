import { getDimensions, IPoint, IPositionChangeCallback, mergeWithAdd } from "../utils";

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
  
  const { left: areaX0, top: areaY0 } = area.getBoundingClientRect();

  function handleMoveTarget({ pageX: mouseX, pageY: mouseY }: MouseEvent) {

    callback({ left: mouseX - areaX0, top: mouseY - areaY0 });
  }
}

function getShift(target: HTMLElement, clickX: number, clickY: number) {
  const { left: x, top: y } = target.getBoundingClientRect();

  return { left: x - clickX, top: y - clickY };
}

//
export function draggableStyle({ left, top }: IPoint) {
  return { position: "absolute", left: `${left}px`, top: `${top}px` } as const;
}

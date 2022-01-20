import { assoc } from "ramda";

interface IMouseEvent
  extends Pick<
    MouseEvent,
    "preventDefault" | "stopPropagation" | "target" | "pageX" | "pageY"
  > {}

interface IAreaCallback {
  (name: string, p: [number, number]): void;
}

interface IItemCallback {
  (p: [number, number]): void;
}

export function createDndAreaHandler(
  area: HTMLDivElement,
  itemSelector: string,
  callback: IAreaCallback
) {
  return function (mouseDown: IMouseEvent) {
    const dndItem = (mouseDown.target as HTMLElement).closest<HTMLDivElement>(
      itemSelector
    );

    if (!dndItem) {
      return;
    }

    const modifiedEvent = assoc("target", dndItem, mouseDown);

    dndHandler(area!, modifiedEvent, (pos) =>
      callback(dndItem.dataset.name!, pos)
    );
  };
}

function dndHandler(
  area: HTMLElement,
  mouseDown: IMouseEvent,
  callback: IItemCallback
) {
  mouseDown.preventDefault();
  mouseDown.stopPropagation();

  document.addEventListener("mousemove", handleMoveTarget);

  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", handleMoveTarget);
  });

  const [shiftX, shiftY] = getTargetShift(
    mouseDown.target as HTMLElement,
    mouseDown.pageX,
    mouseDown.pageY
  );

  
  function handleMoveTarget({ pageX: mouseX, pageY: mouseY }: MouseEvent) {
    const { left: areaX0, top: areaY0 } = area.getBoundingClientRect();
    
    const toAreaX1 = mouseX - shiftX - areaX0;
    const toAreaY1 = mouseY - shiftY - areaY0;

    callback([toAreaX1, toAreaY1]);
  }
}

function getTargetShift(target: HTMLElement, clickX: number, clickY: number) {
  const { left: x, top: y } = target.getBoundingClientRect();

  return [clickX - x, clickY - y];
}

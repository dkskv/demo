interface IMouseEvent
  extends Pick<MouseEvent, "preventDefault" | "target" | "pageX" | "pageY"> {}

interface ICallback {
  (p: [number, number]): void;
}

export function dndHandler(
  area: HTMLElement,
  mouseDown: IMouseEvent,
  callback: ICallback
) {
  mouseDown.preventDefault();

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
    const {
      left: areaX1,
      top: areaY1,
      width: areaWidth,
      height: areaHeight
    } = area.getBoundingClientRect();

    const toAreaX1 = (mouseX - shiftX) - areaX1;
    const toAreaY1 = (mouseY - shiftY) - areaY1;

    callback([toAreaX1 / areaWidth, toAreaY1 / areaHeight]);
  }
}

function getTargetShift(element: HTMLElement, clickX: number, clickY: number) {
  const { left: x, top: y } = element.getBoundingClientRect();

  return [clickX - x, clickY - y];
}

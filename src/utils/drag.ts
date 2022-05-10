import { IPressedKeys } from "./common";
import { getOriginOnPage } from "./domElement";
import { Point } from "./point";

export interface IDragCallbacks {
  onStart(pressedKeys: IPressedKeys): void;
  onChange(a: Point, pressedKeys: IPressedKeys): void;
  onEnd(pressedKeys: IPressedKeys): void;
}

abstract class DragListener {
  constructor(protected element: Element, protected callbacks: IDragCallbacks) {
    this.handleDown = this.handleDown.bind(this);
  }

  /** Возвращает disposer, отменяющий прослушку новых перетаскиваний */
  public launch() {
    this.element.addEventListener("mousedown", this.handleDown);

    return () => this.element.removeEventListener("mousedown", this.handleDown);
  }

  protected abstract createMoveHandler(downEvent: MouseEvent): (moveEvent: MouseEvent) => void

  private handleDown(event: Event) {
    const downEvent = event as MouseEvent;
    downEvent.preventDefault();
    downEvent.stopPropagation();

    const { onStart, onEnd } = this.callbacks;
    onStart(extractPressedKeys(downEvent));

    const handleMove = this.createMoveHandler(downEvent);

    function handleStop(upEvent: MouseEvent) {
      onEnd(extractPressedKeys(upEvent));
      document.removeEventListener("mousemove", handleMove);
    }

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleStop, { once: true });
    document.addEventListener("mouseleave", handleStop, { once: true });
  }
}

/** Подписывает на координаты элемента (на странице) */
export class DragCoordinatesListener extends DragListener {
  protected createMoveHandler(downEvent: MouseEvent) {
    const offset = getEventInnerCoordinates(downEvent);

    return (moveEvent: MouseEvent) => {
      const point = getMousePoint(moveEvent).subtract(offset);
      this.callbacks.onChange(point, extractPressedKeys(moveEvent));
    }
  }
}

/** Подписывает на последовательные смещения координат */
export class DragMovementListener extends DragListener {
  protected createMoveHandler() {
    return (moveEvent: MouseEvent) => {
      const point = new Point(moveEvent.movementX, moveEvent.movementY);
      this.callbacks.onChange(point, extractPressedKeys(moveEvent));
    }
  }
}

/** Получить координаты точки захвата внутри элемента */
function getEventInnerCoordinates(mouseEvent: MouseEvent): Point {
  const targetOrigin = getOriginOnPage(mouseEvent.currentTarget as Element);
  const mousePoint = getMousePoint(mouseEvent);

  return mousePoint.subtract(targetOrigin);
}

/** Координаты мыши на странице */
function getMousePoint(event: MouseEvent) {
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

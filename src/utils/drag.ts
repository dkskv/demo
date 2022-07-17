import { IPressedKeys, noop } from "./common";
import { getMouseOffsetPoint, getMousePoint } from "./dom";
import { Point } from "./point";

export interface IDragCallback {
  (a: Point, pressedKeys: IPressedKeys): void;
}

export interface IDragCallbacks {
  onStart: IDragCallback;
  onChange: IDragCallback;
  onEnd: IDragCallback;
}

export abstract class DragListener {
  protected callbacks: IDragCallbacks = {
    onStart: noop,
    onChange: noop,
    onEnd: noop,
  };

  constructor(protected element: Element) {
    this.handleDown = this.handleDown.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  public setCallbacks(callbacks: IDragCallbacks) {
    this.callbacks = callbacks;
  }

  /** Возвращает disposer, отменяющий прослушку начала новых перетаскиваний */
  public launch() {
    this.element.addEventListener("mousedown", this.handleDown);

    return () => {
      this.element.removeEventListener("mousedown", this.handleDown);
    };
  }

  protected abstract handleStart(downEvent: MouseEvent): void;
  protected abstract handleMove(moveEvent: MouseEvent): void;
  protected abstract handleEnd(upEvent: MouseEvent): void;

  private handleDown(event: Event) {
    const downEvent = event as MouseEvent;
    downEvent.preventDefault();
    downEvent.stopPropagation();

    this.handleStart(downEvent);

    const handleEnd = (upEvent: MouseEvent) => {
      this.handleEnd(upEvent);
      document.removeEventListener("mousemove", this.handleMove);
    };

    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", handleEnd, { once: true });
    document.addEventListener("mouseleave", handleEnd, { once: true });
  }
}

/** Подписывает на координаты элемента (на странице) */
export class DragCoordinatesListener extends DragListener {
  /** Смещение точки захвата относительно origin элемента */
  private offset = Point.nullish;

  protected handleStart(downEvent: MouseEvent) {
    this.offset = getMouseOffsetPoint(downEvent);

    this.callbacks.onStart(
      getMousePoint(downEvent),
      extractPressedKeys(downEvent)
    );
  }

  protected handleMove(moveEvent: MouseEvent) {
    const point = getMousePoint(moveEvent).subtract(this.offset);
    this.callbacks.onChange(point, extractPressedKeys(moveEvent));
  }

  protected handleEnd(upEvent: MouseEvent) {
    this.callbacks.onEnd(getMousePoint(upEvent), extractPressedKeys(upEvent));
  }
}

/** Подписывает на последовательные смещения координат */
export class DragMovementListener extends DragListener {
  protected handleStart(downEvent: MouseEvent) {
    this.callbacks.onStart(Point.nullish, extractPressedKeys(downEvent));
  }

  protected handleMove(moveEvent: MouseEvent) {
    const point = new Point(moveEvent.movementX, moveEvent.movementY);
    this.callbacks.onChange(point, extractPressedKeys(moveEvent));
  }

  protected handleEnd(upEvent: MouseEvent) {
    this.callbacks.onEnd(Point.nullish, extractPressedKeys(upEvent));
  }
}

function extractPressedKeys({
  altKey,
  shiftKey,
  ctrlKey,
}: MouseEvent): IPressedKeys {
  return { altKey, shiftKey, ctrlKey };
}

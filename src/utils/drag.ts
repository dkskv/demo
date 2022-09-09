import { extractPressedKeys, IPressedKeys, noop } from "./common";
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
    this.handleEnd = this.handleEnd.bind(this);
  }

  public setCallbacks(callbacks: IDragCallbacks) {
    this.callbacks = callbacks;
  }

  /** Возвращает disposer, отменяющий прослушку начала новых перетаскиваний */
  public launch() {
    this.element.addEventListener("mousedown", this.handleDown);

    return () => this.dispose();
  }

  private addActiveElementListeners() {
    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.handleEnd, { once: true });
    document.addEventListener("mouseleave", this.handleEnd, { once: true });
  }

  protected removeActiveElementListeners() {
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleEnd);
    document.removeEventListener("mouseleave", this.handleEnd);
  }

  private dispose() {
    this.element.removeEventListener("mousedown", this.handleDown);
    this.removeActiveElementListeners();
  }

  protected abstract handleStart(downEvent: MouseEvent): void;
  protected abstract handleMove(moveEvent: MouseEvent): void;
  protected abstract handleEnd(upEvent: MouseEvent): void;

  private handleDown(event: Event) {
    const downEvent = event as MouseEvent;
    downEvent.preventDefault();
    downEvent.stopPropagation();

    this.handleStart(downEvent);

    this.addActiveElementListeners();
  }
}

/** Подписывает на координаты элемента (на странице) */
export class DragCoordinatesListener extends DragListener {
  /** Смещение точки захвата относительно origin элемента */
  private offset = Point.nullish;

  protected handleStart(downEvent: MouseEvent) {
    this.offset = getMouseOffsetPoint(downEvent);

    const point = getMousePoint(downEvent).subtract(this.offset);

    this.callbacks.onStart(point, extractPressedKeys(downEvent));
  }

  protected handleMove(moveEvent: MouseEvent) {
    const point = getMousePoint(moveEvent).subtract(this.offset);

    this.callbacks.onChange(point, extractPressedKeys(moveEvent));
  }

  protected handleEnd(upEvent: MouseEvent) {
    const point = getMousePoint(upEvent).subtract(this.offset);

    this.callbacks.onEnd(point, extractPressedKeys(upEvent));
    this.removeActiveElementListeners();
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
    this.removeActiveElementListeners();
  }
}

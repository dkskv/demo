import { extractPressedKeys, IPressedKeys, noop } from "./common";
import { getMouseOffsetPoint, getMousePoint } from "./dom";
import { Point } from "./point";

export interface IDragEvent {
  point: Point;
  movement: Point;
  element: HTMLElement;
  pressedKeys: IPressedKeys;
}

export interface IDragCallback {
  (e: IDragEvent): void;
}

export interface IDragCallbacks {
  onStart: IDragCallback;
  onChange: IDragCallback;
  onEnd: IDragCallback;
}

export class DragListener {
  /** Смещение точки захвата относительно origin элемента */
  private offset = Point.nullish;

  private callbacks: IDragCallbacks = {
    onStart: noop,
    onChange: noop,
    onEnd: noop,
  };

  constructor(private element: HTMLElement) {
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  public setCallbacks(callbacks: IDragCallbacks) {
    this.callbacks = callbacks;
  }

  public launch() {
    this.element.addEventListener(
      "mousedown",
      this.handleStart as (e: Event) => void
    );

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
    this.element.removeEventListener(
      "mousedown",
      this.handleStart as (e: Event) => void
    );
    this.removeActiveElementListeners();
  }

  private handleStart(mouseEvent: MouseEvent) {
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();

    this.offset = getMouseOffsetPoint(mouseEvent);
    this.callbacks.onStart(this.mapEvent(mouseEvent));
    this.addActiveElementListeners();
  }

  private handleMove(mouseEvent: MouseEvent) {
    this.callbacks.onChange(this.mapEvent(mouseEvent));
  }

  private handleEnd(mouseEvent: MouseEvent) {
    this.callbacks.onEnd(this.mapEvent(mouseEvent));
    this.removeActiveElementListeners();
  }

  private mapEvent(mouseEvent: MouseEvent): IDragEvent {
    return {
      point: getMousePoint(mouseEvent).subtract(this.offset),
      movement: new Point(mouseEvent.movementX, mouseEvent.movementY),
      element: this.element,
      pressedKeys: extractPressedKeys(mouseEvent),
    };
  }
}

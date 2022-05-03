import { IPressedKeys } from "./common";
import { getOriginOnPage } from "./domElement";
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

export interface IDragCallbacks {
  onStart(pressedKeys: IPressedKeys): void;
  onChange(a: Point, pressedKeys: IPressedKeys): void;
  onEnd(pressedKeys: IPressedKeys): void;
}

export class DragListener {
  constructor(private element: Element, private callbacks: IDragCallbacks) {
    this.handleDown = this.handleDown.bind(this);
  }

  /** Подписывает `callbacks` на намерение переместить элемент (в координатах страницы) */
  public launch() {
    this.element.addEventListener("mousedown", this.handleDown);
  }

  /** Перестать слушать новые перетаскивания (обработка текущего не останавливается) */
  public stop() {
    this.element.removeEventListener("mousedown", this.handleDown);
  }

  private handleDown(event: Event) {
    const downEvent = event as unknown as IMouseEvent;

    downEvent.preventDefault();
    downEvent.stopPropagation();

    const dragPointInsideElement = getMousePointInsideElement(
      this.element,
      downEvent
    );

    const { onStart, onChange, onEnd } = this.callbacks;

    onStart(extractPressedKeys(downEvent));

    const handleMove = (moveEvent: MouseEvent) => {
      const point = getMousePoint(moveEvent).subtract(dragPointInsideElement);
      onChange(point, extractPressedKeys(moveEvent));
    };

    const handleUp = (upEvent: MouseEvent) => {
      onEnd(extractPressedKeys(upEvent));

      document.removeEventListener("mousemove", handleMove);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp, { once: true });
  }
}

/** Получить координаты точки захвата внутри элемента */
function getMousePointInsideElement(
  element: Element,
  mouseEvent: IMouseEvent
): Point {
  const elementOrigin = getOriginOnPage(element);
  const mousePoint = getMousePoint(mouseEvent);

  return mousePoint.subtract(elementOrigin);
}

/** Координаты мыши на странице */
function getMousePoint(event: IMouseEvent) {
  /** todo: Почему не clientX? */
  return new Point(event.pageX, event.pageY);
}

function extractPressedKeys({
  altKey,
  shiftKey,
  ctrlKey,
}: IMouseEvent): IPressedKeys {
  return { altKey, shiftKey, ctrlKey };
}
